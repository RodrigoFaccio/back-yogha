import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import amenities from './routes/amenitiesRoute';

import locationRouter from './routes/accommodationsRoute';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
const app = express();
const port = 4002; // Porta que o aplicativo irá escutar
const SECRETE = 'djashdjksah';

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
app.use('/users', userRoutes);
app.use('/accommodations', locationRouter);
app.use('/amenities', amenities);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Rota de exemplo
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
});

// Tratamento de erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
