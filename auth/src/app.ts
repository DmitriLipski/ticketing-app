import express from 'express';
import 'reflect-metadata';
import bodyParser from 'body-parser';
import { userRouter } from './api/routes/userRouter';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', process.env.MODE !== 'dev');

app.use(bodyParser.json());
app.use(
	cookieSession({
		signed: false,
		// TODO: Change to NODE_ENV
		secure: process.env.MODE === 'prod',
	}),
);

app.use(userRouter);

export { app };
