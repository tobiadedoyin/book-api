import 'dotenv/config';

const {
    TEST_BOILER_NODE_ENV,
    BOILER_TEST_PORT,
    DATABASE_TEST_URL
} = process.env;

export default {
    NODE_ENV: TEST_BOILER_NODE_ENV,
    PORT: BOILER_TEST_PORT,
    DATABASE_URL: DATABASE_TEST_URL
}