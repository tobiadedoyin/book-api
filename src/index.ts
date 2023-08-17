import http from 'http';
import { Express } from 'express';
import { envValidatorSchema } from './shared/validators/env-validator';
import Env from './shared/utils/env';
import Logger from './config/logger';
import { connectDB } from './config/database';
import configureSessionStore from './config/session-store';
import App from './config/express';
import { AppEnv } from './shared/enums';

async function main(App: (...args: any[]) => Express) {
  const logger = new Logger(App.name);

  // run the following three before initializing App function
  await Env.validateEnv(envValidatorSchema);
  await connectDB();
  await configureSessionStore();
  const app = App();

  const server = http.createServer(app);

  const PORT = Env.get<number>('PORT') || 8080;
  const NODE_ENV = Env.get<string>('NODE_ENV');

  NODE_ENV !== AppEnv.PRODUCTION &&
    server.on('listening', () => {
      logger.log(`listening on http://localhost:${PORT}`);
    });

  server.listen(PORT);
}

main(App);
