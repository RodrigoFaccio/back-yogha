import { Request, Response } from 'express';
import { getUsers, loginUsers, getBookingsUser } from '../../services/users';
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
