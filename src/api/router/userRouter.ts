import { logger } from "../../util/logger";
import userController from "../controller/userController";
import { Router } from "express";
import { UserRepository } from "../repo/userRepo";
import authUserRouter from "./authUserRouter";

class userRouter{
    public router : Router;
    constructor() {
    this.router = Router();
    this.initRouter();
    }
    initRouter(){
        // this.router.post("/register",userController.createAuthUser);
       this.router.post("/create/jwt/token",userController.createToken);
        this.router.post('/logout',userController.logout);
        this.router.post('/refreshToken',userController.refreshToken);  
        this.router.get("/getAll/auth/session",userController.getAll);
        this.router.post('/refresh/token',userController.refreshToken);
        this.router.post('/session/logout',userController.logout);
        this.router.use('/user',authUserRouter);
    }
}
export default new userRouter().router;