import express, { Request, Response } from 'express';
import Container from 'typedi';
import { UserController } from '../../controllers/UserController';
const router = express.Router();
const userController = Container.get(UserController);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.all('/api/users', (req: Request, res: Response) => {
	return userController.handleGetAllUsers(req, res);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.all('/api/users/sign-up', (req: Request, res: Response) => {
	return userController.handleSignUp(req, res);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.all('/api/users/sign-in', (req: Request, res: Response) => {
	return userController.handleSignIn(req, res);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.all('/api/users/current-user', (req: Request, res: Response) => {
	return userController.handleGetCurrentUser(req, res);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.all('/api/users/sign-out', (req: Request, res: Response) => {
	return userController.handleSignOut(req, res);
});

export { router as userRouter };
