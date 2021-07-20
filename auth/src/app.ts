import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './api/routes/userRouter';
import cookieSession from 'cookie-session';
import './db/mongoose';

const app = express();
app.set('trust proxy', true); //TODO :Check

app.use(bodyParser.json());
app.use(
	cookieSession({
		signed: false,
		secure: true,
	}),
);

app.use(userRouter);

export default app;
