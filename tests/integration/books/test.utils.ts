import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { expect } from 'chai';
// import app from 'src/config/express';

chai.use(chaiHttp);
//   const loginPayload = {
//     username: 'hamid',
//     password: 'Password@1',
//   };

//   const res = await chai
//     .request(app)
//     .post('/api/v1/auth/login')
//     .send(loginPayload);

//   expect(res.statusCode).to.equal(StatusCodes.OK);
//   return res.body.data.token;
// };

interface Client {
  getToken: () => string;
  getStoredBookId: () => string;
  login: (username: string, password: string) => Promise<string>;
  fetchAndSetBookId: (token: string) => Promise<void>;
  put: (
    pathParam: string,
    options: { token?: string; body: any }
  ) => Promise<ChaiHttp.Response>;
  delete: (
    pathParam: string,
    options: { token?: string }
  ) => Promise<ChaiHttp.Response>;
  get: (
    pathParam: string,
    options: { token?: string }
  ) => Promise<ChaiHttp.Response>;
}

export const createTestClient = (app: any, baseURL: string): Client => {
  let authToken = '';
  let storedBookId = '';

  const client: Client = {
    getToken: () => authToken,
    getStoredBookId: () => storedBookId,

    login: async (username: string, password: string): Promise<string> => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/login') // Adjust endpoint as per your app
        .send({ username, password });

      if (res.status === StatusCodes.OK) {
        authToken = res.body.token;
        return authToken;
      } else {
        throw new Error('Login failed');
      }
    },

    fetchAndSetBookId: async (token: string) => {
      const res = await chai
        .request(app)
        .get(`${baseURL}/`) // Adjust based on how you fetch a book
        .set('Authorization', `Bearer ${token}`);

      if (
        res.status === StatusCodes.OK &&
        res.body.data &&
        res.body.data.length > 0
      ) {
        storedBookId = res.body.data[0].id; // Assuming response has book IDs
      } else {
        throw new Error('No books available to fetch');
      }
    },

    put: async (pathParam = '', { token = authToken, body }) => {
      const res = await chai
        .request(app)
        .put(`${baseURL}/${pathParam}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);
      return res;
    },

    delete: async (pathParam = '', { token = authToken }) => {
      const res = await chai
        .request(app)
        .delete(`${baseURL}/${pathParam}`)
        .set('Authorization', `Bearer ${token}`);
      return res;
    },

    get: async (pathParam = '', { token = authToken } = {}) => {
      // New get method
      const res = await chai
        .request(app)
        .get(`${baseURL}/${pathParam}`)
        .set('Authorization', `Bearer ${token}`);
      return res;
    },
  };

  return client;
};

interface ExpectSuccess {
  (res: ChaiHttp.Response, message?: string): void;
}

export const expectSuccess: ExpectSuccess = (res, message) => {
  expect(res.status).to.equal(StatusCodes.OK);
  expect(res.body.status).to.equal('success');
  if (message) {
    expect(res.body.message).to.equal(message);
  }
};

interface ExpectUnauthorized {
  (res: ChaiHttp.Response): void;
}

export const expectUnauthorized: ExpectUnauthorized = (res) => {
  expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
  expect(res.body.status).to.equal('error');
  expect(res.body.message).to.equal('Unauthorized');
};
