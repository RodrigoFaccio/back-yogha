import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { getUsers, loginUsers, getBookingsUser, createUserService } from '../../services/users';
export const getUsersController = async (req: Request, res: Response) => {
  const users = await getUsers();
  res.json(users);
};

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: "Campos 'email' e 'password' são obrigatórios."
    });
  }

  try {
    const users = await loginUsers(email, password);
    res.json(users);
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message
    });
  }
};
export const bookingController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit } = req.query;

  try {
    const users = await getBookingsUser(id, limit);
    res.json(users);
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message
    });
  }
};
export const createUser = async (req: Request, res: Response) => {
  const { email, mobile_phone, document, surname, password, name } = req.body;
  const cryptPassword = await bcrypt.hash(password, 10);
  const data = {
    email,
    mobile_phone,
    document,
    surname,
    password: cryptPassword,
    name
  };

  try {
    const user = await createUserService(data);
    if (user.code === 400) {
      res.status(400).json(user);
    }
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};
