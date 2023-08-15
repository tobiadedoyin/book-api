import app from '../src/app';
import { agent } from 'supertest';

describe('Test the root path', () => {
  test('/ It should response the GET method with a 404', () => {
    return agent(app).get('/').expect(404);
  });
});
