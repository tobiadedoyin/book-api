import { Router } from 'express';
import authenticationController from './controller';
import { WatchAsyncController } from '../shared/utils/watch-async-controller';
import ROUTES from './const';
import { LoginModeValidatorMiddleware } from './middlewares/login-mode-validator.middleware';
import { RequestBodyValidatorMiddleware } from '../shared/middlewares/request-body-validator.middleware';
import { signupPayloadValidatorSchema } from './validators/signup-payload-validator.schema';

const authenticationRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints for authentication operations
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    summary: handles google oauth flow, logs user in if their account already exist, signs them up otherwise
 *    tags: [Authentication]
 *    parameters:
 *      - in: query
 *        name: mode
 *        description: mode
 *        schema:
 *          type: string
 *          enum: [email, phone]
 *          default: email
 *          required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: "johndoe@email.com"
 *                required: false
 *              phone_number:
 *                type: string
 *                example: "1234567890"
 *                required: false
 *              password:
 *                type: string
 *                example: "password"
 *                required: true
 *    responses:
 *      200:
 *        description: ok
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  example: "xxx-xxx-xxx"
 *                  required: true
 *                  description: token
 */
authenticationRouter.post(
  ROUTES.LOGIN,
  LoginModeValidatorMiddleware,
  WatchAsyncController(authenticationController.login),
);

/**
 * @swagger
 * /api/v1/auth/signup:
 *  post:
 *    summary: handles email signups
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              first_name:
 *                  type: string
 *                  example: "john"
 *                  required: true
 *              last_name:
 *                  type: string
 *                  example: "doe"
 *                  required: true
 *              email:
 *                  type: string
 *                  example: "johndoe@gmail.com"
 *                  required: true
 *              phone_number:
 *                  type: string
 *                  example: "+234112666419"
 *                  required: true
 *              password:
 *                  type: string
 *                  example: "password"
 *                  required: true
 *              confirm_password:
 *                  type: string
 *                  example: "password"
 *                  required: true
 *
 *    responses:
 *      200:
 *        description: ok

 */
authenticationRouter.post(
  ROUTES.SIGNUP,
  RequestBodyValidatorMiddleware(signupPayloadValidatorSchema),
  WatchAsyncController(authenticationController.signup),
);

/**
 * @swagger
 * /api/v1/auth/google/oauth:
 *  post:
 *    summary: handles google oauth flow, logs user in if their account already exist, signs them up otherwise
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              idToken:
 *                type: string
 *                example: "xxx-xxx-xxx"
 *                required: true
 *    responses:
 *      200:
 *        description: ok
 */
authenticationRouter.post(
  ROUTES.GOOGLE_OAUTH,
  WatchAsyncController(authenticationController.demo),
);

export default authenticationRouter;
