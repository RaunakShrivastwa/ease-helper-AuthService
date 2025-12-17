import express from 'express';
import dotenv from 'dotenv';
import { logger } from './util/logger';
import dataBase from './config/dataBase';
import userRouter from './api/router/userRouter';
import cookieParser from "cookie-parser";
import { UserRepository } from './api/repo/userRepo';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
let sessionRepo = new UserRepository('session');
let user = new UserRepository('user');

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', userRouter);

async function initTable(){
     await sessionRepo.createAuthTable();
     await user.createUserInfoTable();
}

app.listen(PORT, (err) => {
    if(err){
        logger.error(`Failed to start server: ${err.message}`);
    }
    dataBase.connectDatabase();
    initTable();
    
  logger.info(`Auth Service is running on port ${PORT}`);
});
