import { configDotenv } from 'dotenv';
configDotenv();

const development = {
  NODE_ENV: process.env.BOILER_NODE_ENV,
  PORT: process.env.BOILER_PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  PAPERTRAIL_HOST: process.env.BOILER_PAPERTRAIL_HOST,
  PAPERTRAIL_URL: process.env.BOILER_PAPERTRAIL_URL,
};

export default development;
