import development from "./development";
import test from './test';

const { BOILER_NODE_ENV } = process.env;

export default {
    development,
    test
}[BOILER_NODE_ENV || 'development']
