import { Router } from 'express';
import userController from './controller';
import ROUTES from './const';
import AuthMiddleware from '../shared/middlewares/auth.middleware';
import QuerySessionUserMiddleware from '../shared/middlewares/query-session-user.middleware';

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints for User Resources
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get a user currently session
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
userRouter.get(
  ROUTES.GET_USER,
  AuthMiddleware,
  QuerySessionUserMiddleware,
  userController.getUser,
);

export default userRouter;
