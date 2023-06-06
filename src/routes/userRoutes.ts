import express, { NextFunction, Request, Response } from 'express';
import { bookingController, getUsersController, loginUserController } from '../controllers/users';
import { verifyJWT } from '../utils/jwt';

const router = express.Router();

router.get('/', verifyJWT, getUsersController);
router.post('/login', loginUserController);
router.get('/bookings/:id', bookingController);

export default router;
