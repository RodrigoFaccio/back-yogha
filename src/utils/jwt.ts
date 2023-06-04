import express, { Request, Response, NextFunction } from 'express';
const SECRETE = 'djashdjksah';
import jwt, { JwtPayload } from 'jsonwebtoken';
interface CustomRequest extends Request {
  userId?: string;
}
const verifyJWT = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers['authorization'];

  if (authorizationHeader) {
    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer === 'Bearer' && token) {
      jwt.verify(token, SECRETE, (error, decoded: any) => {
        if (error) {
          return res.status(401).json('Token inválido');
        }

        const userId = decoded.userId;
        req.userId = userId;
        (req as any).token = userId;
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
