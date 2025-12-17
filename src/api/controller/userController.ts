import { Request, Response } from "express";
import passwordHasing from "../validators/passwordHasing";
import { UserServiceImpl } from "../service/userServiceImpl";
import dotenv from "dotenv";
import jwtHelper from "../jwt/jwtHelper";
import crypto from "crypto";
import { Auth } from "../model/Auth";
import { jwtDecode } from "jwt-decode";
import { UserRepository } from "../repo/userRepo";

dotenv.config();

const userService = new UserServiceImpl('userinfo');
const authUserService = new UserServiceImpl('session');

class userController {

  async createAuthUser(req: Request, res: Response) {
    try{
      if(!req.body){
        return  res.status(400).json({ message: "Bad Request, No Data Provided" });
      }

      console.log(req.body)
      req.body.password = await passwordHasing.hashPassword(req.body.password);
      let newUser = await userService.createAuth(req.body);
      console.log(newUser);
      
      
      res.status(201).json(newUser)
    }catch(err){
      return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
  }

  async createToken(req: Request, res: Response) {

    if (!req.body || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    if (req.cookies.refreshToken) {
      return res.status(400).json({ message: "Already Logged In" });
    }

    try {
      let user = await userService.findByEmail(req.body.email, res);
      console.log(user);
      
      if (!user || !(await passwordHasing.comparePassword(req.body.password, user.password))) {
        return res.status(404).json({ message: "Invalid Email or Password" });
      }

      const payload = {
        sub: user.id,
        role: user.role,
        tv: crypto.randomUUID(),
      };

      const accessToken = jwtHelper.signAccessToken(payload);
      let refreshToken = jwtHelper.signRefreshToken(payload);
      let auth: Auth = new Auth(
        user.id, await passwordHasing.hashPassword(refreshToken), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        req.headers["user-agent"] || "unknown",
        "clientIp");
      await authUserService.createAuth(auth);

      console.log(accessToken);
      

      return res.status(200).json({ token: accessToken, refreshToken: refreshToken });
    } catch (err) {
      return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
  }

  async refreshToken(req: Request, res: Response) {
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized, No Refresh Token" });
    }

    try {
      let decode = jwtHelper.verifyRefreshToken(refreshToken) as any;
      
      let sessions = await authUserService.findById(Number(decode.sub), res);
      if (!sessions || sessions.length === 0) {
        return res.status(401).json({ message: "Unauthorized, Invalid Session" });
      }
  
      let exactSession : any = null;
      for (const session of sessions) {
        const match = await passwordHasing.comparePassword(refreshToken, session.refreshtoken);
        if (match) {
          exactSession = session;
          break;
        }
      }

      console.log("found session",exactSession);
      

      if (!exactSession) {
        return res.status(401).json({ message: "Unauthorized, Invalid Session" });
      }

      // change revoke status
      if (exactSession.isrevoked) {
        return res.status(401).json({ message: "Unauthorized, Session Revoked" });
      }
      let repo = new UserRepository("session");
      await repo.revokeSessionById(Number(exactSession.id));

      console.log(decode);

      const payload = {
        sub: decode.sub,
        role: decode.role,
        tv: crypto.randomUUID(),
      };

      const newaccessToken = jwtHelper.signAccessToken(payload);
      let newRefreshToken = jwtHelper.signRefreshToken(payload);
      let auth: Auth = new Auth(
        decode.sub, await passwordHasing.hashPassword(newRefreshToken), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        req.headers["user-agent"] || "unknown",
        "clientIp");
      await authUserService.createAuth(auth);

      return res.status(200).json({ token: newaccessToken, newrefreshToken: newRefreshToken });

    } catch (err) {
      return res.status(500).json({ message: `Internal Server Error ${err}` });
    }


  }

  async getAll(req: Request, res: Response) {
    try {
      let authSessions = await authUserService.getAllAuthSessions();
      return res.status(200).json({ authSessions });
    } catch (err) {
      return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
  }
  
  async logout(req: Request, res: Response) {

    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized, No Refresh Token" });
    }

    try {
      let decode = jwtHelper.verifyRefreshToken(refreshToken) as any;
      
      let sessions = await authUserService.findById(Number(decode.sub), res);
      if (!sessions || sessions.length === 0) {
        return res.status(401).json({ message: "Unauthorized, Invalid Session" });
      }
  
      let exactSession : any = null;
      for (const session of sessions) {
        const match = await passwordHasing.comparePassword(refreshToken, session.refreshtoken);
        if (match) {
          exactSession = session;
          break;
        }
      }
      if (!exactSession) {
        return res.status(401).json({ message: "Unauthorized, Invalid Session" });
      }

      // change revoke status
      if (exactSession.isrevoked) {
        return res.status(401).json({ message: "Unauthorized, Session Revoked" });
      }
      let repo = new UserRepository("session");
      await repo.revokeSessionById(Number(exactSession.id));
      return res.status(200).json({ isLogout: true });

    } catch (err) {
      return res.status(500).json({ message: `Internal Server Error ${err}` });
    }

  }

}

export default new userController();
