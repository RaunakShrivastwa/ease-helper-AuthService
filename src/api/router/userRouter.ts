import { logger } from "../../util/logger";
import userController from "../controller/userController";
import { Router } from "express";
import { UserValidators } from "../validators/userValidator";
import { UserRepository } from "../repo/userRepo";

class userRouter{
    public router : Router;

    constructor() {
    this.router = Router();
     new UserRepository("Auth")
      .createTable()
      .then((msg) => {
        logger.info(msg);
      })
      .catch((err) => {
        logger.warn("Error creating user table: " + err.message);
      });
    this.initRouter();
    }
    initRouter(){
       this.router.post("/create/jwt/token",userController.createToken);
        this.router.post('/logout',userController.logout);
        this.router.post('/refreshToken',userController.refreshToken);  
        this.router.get("/getAll/auth/session",userController.getAll);
        this.router.post('/refresh/token',userController.refreshToken);
        this.router.post('/session/logout',userController.logout);
    }
}

export default new userRouter().router;