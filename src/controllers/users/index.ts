import { Request, Response } from 'express';
import { getUsers, loginUsers } from '../../services/users';
export const getUsersController = async (req: Request, res: Response) => {
  const users = await getUsers();
  res.json(users);
};

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const users = await loginUsers(email, password);
    res.json(users);
  } catch (error: any) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message
    });
  }
};
