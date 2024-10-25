import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe, it, before } from 'mocha';
import { StatusCodes } from 'http-status-codes';
import app from '../../../src/config/express';
import { faker } from '@faker-js/faker';
import path from 'path';
import fs from 'fs';

chai.use(chaiHttp);

const generatePayload = () => ({
  title: faker.lorem.words(3),
  authors: [faker.person.fullName()],
  publisher: faker.company.name(),
  published: faker.date.past({ years: 30 }).toISOString().split('T')[0],
  genre: [faker.music.genre()],
  summary: faker.lorem.sentences(3),
  cover_image: fs.readFileSync(path.join(__dirname, 'tobi.jpg')),
});

const baseURL = '/api/v1/books';
let bookId: string;
let authToken: string = '';
export const loginAndGetToken = async (): Promise<string> => {
  const loginPayload = {
    username: 'hamid',
    password: 'Password@1',
  };

  const res = await chai
    .request(app)
    .post('/api/v1/auth/login')
    .send(loginPayload);

  expect(res.statusCode).to.equal(StatusCodes.OK);
  return res.body.data.token;
};

describe('BookController with Authentication', function () {
  this.timeout(20000);

  before(async function () {
    // this.timeout(15000);
    authToken = await loginAndGetToken();
  });

  describe('BookController -> createBook', () => {
    it('should create book successfully', (done) => {
      const payload = generatePayload();

      chai
        .request(app)
        .post(`${baseURL}/`)
        .set('Authorization', `JWT ${authToken}`)
        .set('Content-Type', 'multipart/form-data')
        .field('title', payload.title)
        .field('authors', payload.authors.join(','))
        .field('publisher', payload.publisher)
        .field('published', payload.published)
        .field('genre', payload.genre.join(','))
        .field('summary', payload.summary)
        .attach('cover_image', payload.cover_image, 'tobi.jpg')
        .end((_err, res) => {
          console.log('Response body:', res.body);
          expect(res.statusCode).to.equal(StatusCodes.CREATED);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal(`Book created successfully`);
          bookId = res.body.data.id;
          console.log('>>>>>>>id', bookId);
          done();
        });
      done();
    });

    it('should not create a book when an invalid token is added to the authorization header', (done) => {
      const payload = generatePayload();
      chai
        .request(app)
        .post(baseURL)
        .set('Authorization', `JWT ${authToken}kdlsjdlkjslkdj`)
        .set('Content-Type', 'multipart/form-data')
        .field('title', payload.title)
        .field('authors', payload.authors.join(','))
        .field('publisher', payload.publisher)
        .field('published', payload.published)
        .field('genre', payload.genre.join(','))
        .field('summary', payload.summary)
        .attach('cover_image', payload.cover_image, 'tobi.jpg')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });
  });
});

// export default bookId;
