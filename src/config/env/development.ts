import 'dotenv/config';

const {
    BOILER_NODE_ENV,
    BOILER_DEV_PORT,
    DATABASE_DEV_URL
} = process.env;

export default {
    NODE_ENV: BOILER_NODE_ENV,
    PORT: BOILER_DEV_PORT,
    DATABASE_URL: DATABASE_DEV_URL
}
