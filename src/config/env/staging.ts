import { configDotenv } from 'dotenv';
configDotenv();

const staging = {
  NODE_ENV: process.env.TEMPLATE_NODE_ENV,
  PORT: process.env.TEMPLATE_PORT,
  DATABASE_URL: process.env.TEMPLATE_DEV_DATABASE_URL,
  PAPERTRAIL_HOST: process.env.TEMPLATE_DEV_PAPERTRAIL_HOST,
  PAPERTRAIL_PORT: process.env.TEMPLATE_DEV_PAPERTRAIL_PORT,
  JWT_SECRET: process.env.TEMPLATE_JWT_SECRET,
  CRYPTO_SECRET: process.env.TEMPLATE_CRYPTO_SECRET,
  CRYPTO_TIME_STEP: process.env.TEMPLATE_CRYPTO_TIME_STEP,
  CRYPTO_OTP_LENGTH: process.env.TEMPLATE_CRYPTO_OTP_LENGTH,
  CRYPTO_HASH_ALGO: process.env.TEMPLATE_CRYPTO_HASH_ALGO,
  SALT_ROUND: process.env.TEMPLATE_SALT_ROUND,
};

export default staging;
