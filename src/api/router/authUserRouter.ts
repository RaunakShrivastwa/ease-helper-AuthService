import { logger } from "../../util/logger";
import userController from "../controller/userController";
import { Router } from "express";
import { UserRepository } from "../repo/userRepo";

class AuthUserRouter{
    public router : Router;
    constructor() {
    this.router = Router();
    new UserRepository('user');
    this.initRouter();
    }
    initRouter(){
        this.router.post("/register",userController.createAuthUser);
    }
}

export default new AuthUserRouter().router;