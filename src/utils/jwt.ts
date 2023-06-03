import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const SECRETE = 'djashdjksah';

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers['authorization'];

  if (authorizationHeader) {
    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer === 'Bearer' && token) {
      jwt.verify(token, SECRETE, (error, decode) => {
        if (error) return res.status(401).json('Token inválido');

        next();
      });
    } else {
      return res.status(401).json('Formato de token inválido');
    }
  } else {
    return res.status(400).json('Token não encontrado');
  }
};
export { verifyJWT };
