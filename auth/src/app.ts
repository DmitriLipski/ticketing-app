import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './api/routes/userRouter';

const app = express();
app.use(bodyParser.json());
app.use(userRouter);

export default app;
