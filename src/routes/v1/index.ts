import express from 'express';
import bookRouter from '../../modules/books/routes';
import authRouter from '../../modules/authentication/routes';

const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/books', bookRouter);

export const Router = appRouter;
