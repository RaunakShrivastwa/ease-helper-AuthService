import express from 'express';
import dotenv from 'dotenv';
import { logger } from './util/logger';
import dataBase from './config/dataBase';
import userRouter from './api/router/userRouter';
import cookieParser from "cookie-parser";
import { UserRepository } from './api/repo/userRepo';
import { connectProducer } from './event/producer';
// import { consuming } from './event/consumer';
import cors from 'cors';
import { deleteConsuming } from './event/consumer';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
let sessionRepo = new UserRepository('session');
let userRepo = new UserRepository('userinfo');

app.use(express.json());
app.use(cors({
  origin: "http://localhost:8000", // 👈 EJS / NotificationService
  credentials: true,
}))

app.use(cookieParser());
app.use('/api/v1/auth', userRouter);



app.listen(PORT, (err) => {
    if(err){
        logger.error(`Failed to start server: ${err.message}`);
    }
    startServer();
   
});


async function  startServer(){
     await dataBase.connectDatabase();
     let a = await sessionRepo.createAuthTable();
     let b = await userRepo.createUserInfoTable();
     logger.info(a);
     logger.info(b);
     await connectProducer();
    //  await consuming();
    await deleteConsuming();
    logger.info(`Auth Service is running on port ${PORT}`);
}
