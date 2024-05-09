import { configDotenv } from 'dotenv';
configDotenv();

const test = {
  NODE_ENV: process.env.TEMPLATE_NODE_ENV,
  PORT: process.env.TEMPLATE_PORT,
  DATABASE_URL: process.env.TEMPLATE_TEST_DATABASE_URL,
  PAPERTRAIL_HOST: process.env.TEMPLATE_TEST_PAPERTRAIL_HOST,
  PAPERTRAIL_PORT: process.env.TEMPLATE_TEST_PAPERTRAIL_PORT,
};

export default test;
