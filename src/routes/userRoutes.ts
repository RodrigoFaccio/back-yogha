import express, { NextFunction, Request, Response } from 'express';
import { getUsersController, loginUserController } from '../controllers/users';
import { verifyJWT } from '../utils/jwt';

const router = express.Router();

router.get('/', getUsersController);
router.post('/login', loginUserController);

export default router;
