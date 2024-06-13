import development from './development';
import test from './test';
import { JwtSignature } from '../../shared/interfaces';

export const JwtSignOptions: JwtSignature = {
  issuer: 'Template',
  subject: 'Authentication Token',
  audience: 'https://template.com',
};

export default {
  development,
  test,
}[process.env.TEMPLATE_NODE_ENV || 'development'];
