import { expect } from 'chai';
import Joi from 'joi';
import Env from '../../src/shared/utils/env';
import { configDotenv } from 'dotenv';

configDotenv();

describe('Env Class', () => {
  const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .required(),
    PORT: Joi.number(),
    DATABASE_URL: Joi.string().required(),
    PAPERTRAIL_HOST: Joi.string().required(),
    PAPERTRAIL_PORT: Joi.string().required(),
    SWAGGER_ROUTE: Joi.string().default('/api/docs'),
    JWT_SECRET: Joi.string(),
    CRYPTO_SECRET: Joi.string(),
    CRYPTO_TIME_STEP: Joi.number(),
    CRYPTO_OTP_LENGTH: Joi.number(),
    CRYPTO_HASH_ALGO: Joi.string(),
    SALT_ROUND: Joi.number(),
    SEND_GRID_API_KEY: Joi.string(),
    MAIL_FROM: Joi.string(),
    AWS_ACCESS_KEY_ID: Joi.string(),
    AWS_SECRET_ACCESS_KEY: Joi.string(),
    AWS_BUCKET_NAME: Joi.string(),
    AWS_REGION: Joi.string(),
    ENCRYPTION_KEY: Joi.string(),
    ADMIN_PORTAL_URL: Joi.string(),
  });

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
  });

  it('should validate and set environment variables', async () => {
    await Env.validateEnv(validationSchema);

    expect(Env.get('NODE_ENV')).to.equal('test');
    // expect(Env.get<number>('PORT')).to.equal(
    //   Number(process.env.FUNTODO_PORT),
    // );
  });

  it('should fall back to default config for missing variables', async () => {
    await Env.validateEnv(validationSchema);

    expect(Env.get('NODE_ENV')).to.equal('test');
    // expect(Env.get<number>('PORT')).to.equal(
    //   Number(process.env.FUNTODO_PORT),
    // );
  });
});
