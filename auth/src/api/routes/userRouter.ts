import express, { Request, Response } from 'express';
import Container from 'typedi';
import { UserController } from '../../controllers/UserController';
const router = express.Router();
const userController = Container.get(UserController);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.all('/api/users', (req: Request, res: Response) => {
	return userController.handleGetUsersRequest(req, res);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.all('/api/users/sign-up', (req: Request, res: Response) => {
	return userController.handleSignUpRequest(req, res);
});

export { router as userRouter };
