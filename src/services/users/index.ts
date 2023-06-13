import { UserResponse } from '../../models/Users';
import QueryString from 'qs';
import dotenv from 'dotenv';
dotenv.config();

import pool from '../../database/bd';
import { QueryResult } from 'pg';
import bcrypt from 'bcrypt';
import AppError, { ErrorProps } from '../../error/AppError';
import jwt, { Secret } from 'jsonwebtoken';
import knex from 'knex';
import db from '../../database/bd';

export const getUsers = async (): Promise<any[]> => {
  try {
    const users = await db('public.users').select('id', 'name', 'email');
    return users;
  } catch {
    throw new AppError('Não ha usuarios');
  }
};

export const loginUsers = async (email: string, password: string): Promise<UserResponse> => {
  const user = await db('public.customers').select('*').where('email', '=', email);
  if (user.length > 0) {
    let hash = user[0].password;
    console.log(password);

    const match = await bcrypt.compare(password, hash);
    console.log(match);

    if (match) {
      const token = jwt.sign(
        {
          userId: user[0].id
        },
        process.env.SECRET as Secret,
        { expiresIn: 1800 }
      );
      const userToken = {
        ...user[0],
        token: token
      };

      return userToken;
    } else {
      throw new AppError('E-mail ou senha incorretos');
    }
  } else {
    throw new AppError('Usuário não encontrado');
  }
};
export const getBookingsUser = async (
  id: string,
  limit: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined
): Promise<any[]> => {
  try {
    const bookings = await db('avantio.booking')
      .select('*', 'public.customers.id as idUser', 'avantio.booking.id as idBooking')
      .leftJoin('public.customers', 'public.customers.id', '=', 'avantio.booking.customer_id')
      .where('avantio.booking.customer_id', '=', id)
      .limit(Number(limit));
    return bookings;
  } catch {
    throw new AppError('Não ha acomodações para esse usuário');
  }
};
