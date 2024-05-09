import { configDotenv } from 'dotenv';
configDotenv();

const development = {
  NODE_ENV: process.env.TEMPLATE_NODE_ENV,
  PORT: process.env.TEMPLATE_PORT,
  DATABASE_URL: process.env.TEMPLATE_DEV_DATABASE_URL,
  PAPERTRAIL_HOST: process.env.TEMPLATE_DEV_PAPERTRAIL_HOST,
  PAPERTRAIL_PORT: process.env.TEMPLATE_DEV_PAPERTRAIL_PORT,
};

export default development;
