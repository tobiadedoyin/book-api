import express, { Express } from 'express';
import { GlobalErrorCatcherMiddleware } from '../shared/middlewares/global-error-catcher.middleware';
import RequestLoggerMiddleware from '../shared/middlewares/request-logger.middleware';
import ResponseLoggerMiddleware from '../shared/middlewares/response-logger.middleware';
import ROUTES from '../const.routes';
import versionOneRouter from '../route';

import Env from '../shared/utils/env';
import Swagger from '../config/swagger';
import { AppEnv } from '../shared/enums';

export default function App(): Express {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(RequestLoggerMiddleware);
  app.use(ResponseLoggerMiddleware);

  const NODE_ENV = Env.get<string>('NODE_ENV');

  const SWAGGER_ROUTE = Env.get<string>('SWAGGER_ROUTE');

  Swagger(app, {
    swaggerDocRoute: SWAGGER_ROUTE,
    definitionsPath: [
      NODE_ENV == AppEnv.DEVELOPMENT ? './**/*.ts' : './**/*.js',
    ],
    explorer: true,
  });

  app.disable('x-powered-by');
  app.use(ROUTES.V1_PATH, versionOneRouter);

  app.use(GlobalErrorCatcherMiddleware); // must be last applied middleware to catch globalErrs

  return app;
}
