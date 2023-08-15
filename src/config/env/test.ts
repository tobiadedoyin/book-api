import 'dotenv/config';

const {
    TEST_BOILER_NODE_ENV,
    BOILER_TEST_PORT,
} = process.env;

export default {
    NODE_ENV: TEST_BOILER_NODE_ENV,
    PORT: BOILER_TEST_PORT
}
