import express from 'express';
import customerRouter from '../../modules/customers/routes';

const appRouter = express.Router();

appRouter.use('/customers', customerRouter);

export const Router = appRouter;
