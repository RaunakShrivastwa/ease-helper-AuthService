import express from 'express';
import dotenv from 'dotenv';
import { logger } from './util/logger';
import dataBase from './config/dataBase';
import userRouter from './api/router/userRouter';
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', userRouter);

app.listen(PORT, (err) => {
    if(err){
        logger.error(`Failed to start server: ${err.message}`);
    }
    dataBase.connectDatabase();
  logger.info(`Auth Service is running on port ${PORT}`);
});