import development from './development';
import test from './test';

export default {
  development,
  test,
}[process.env.NCTP_DATA_MINING_NODE_ENV || 'development'];
