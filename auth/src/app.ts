import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './api/routes/userRouter';
import './db/mongoose';

const app = express();
app.use(bodyParser.json());
app.use(userRouter);

export default app;
