import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const bootstrap = async () => {
  await connectMongoDB();

  const app = express();

  app.use(logger);
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: true,
    }),
  );
  app.use(cookieParser());

  app.use(authRouter);
  app.use(notesRouter);
  app.use(userRouter);

  app.use(notFoundHandler);
  app.use(errors());
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

bootstrap();