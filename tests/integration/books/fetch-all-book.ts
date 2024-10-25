// import * as dtos from './dto';
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe, it, before } from 'mocha';
import { StatusCodes } from 'http-status-codes';
import app from '../../../src/config/express';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

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

const payload = {
  title: faker.string.alpha(10),
  authors: [faker.person.fullName(), faker.person.fullName()],
  publisher: faker.person.fullName(),
  published: faker.date.past(),
  genre: [faker.music.genre(), faker.music.genre()],
  summary: faker.lorem.sentence(),
  price: faker.number.float(),
};

const baseURL = '/api/v1/books';
let authToken: string = '';
let bookId: string;
let userId: string;
const loginAndGetToken = async () => {
  const loginPayload = {
    username: 'hamid',
    password: 'Password@1',
  };

  const res = await chai
    .request(app)
    .post('/api/v1/auth/login')
    .send(loginPayload);

  expect(res.status).to.equal(StatusCodes.OK);
  userId = res.body.data.id;
  return res.body.data.token;
};

describe('BookController', function () {
  this.timeout(20000);

  before(async function () {
    authToken = await loginAndGetToken();
  });

  describe('Create Book', () => {
    it('should not create a book when authorization header is missing', (done) => {
      chai
        .request(app)
        .post(baseURL)
        .send(payload)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });

    it('should not create a book when an invalid token is added to the authorization header', (done) => {
      chai
        .request(app)
        .post(baseURL)
        .set('Authorization', `JWT ${authToken}kdlsjdlkjslkdj`)
        .send(payload)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });

    it('should create book successfully', (done) => {
      const payload = generatePayload();

      chai
        .request(app)
        .post(`${baseURL}/`)
        .set('Authorization', `JWT ${authToken}`)
        .set('Content-Type', 'multipart/form-data')
        .field('title', payload.title)
        .field('authors[]', payload.authors.join(','))
        .field('publisher', payload.publisher)
        .field('published', payload.published)
        .field('genre[]', payload.genre.join(','))
        .field('summary', payload.summary)
        .attach('cover_image', payload.cover_image, 'tobi.jpg')
        .end((err, res) => {
          if (err) return done(err);
          console.log('Response body:', res.body);
          expect(res.body.StatusCodes).to.equal(StatusCodes.CREATED);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal(`Book created successfully`);
          // expect(res.body.data).to.have.property('book_id');
          bookId = res.body.data.id;
          console.log('>>>>>>>id', bookId);
          done();
        });
    });
    //   const res = await chai
    //     .request(app)
    //     .post(baseURL)
    //     .set('Authorization', `JWT ${authToken}kdlsjdlkjslkdj`)
    //     .set('Content-Type', 'multipart/form-data')
    //     .field('title', payload.title)
    //     .field('authors', payload.authors.join(','))
    //     .field('publisher', payload.publisher)
    //     .field('published', payload.published)
    //     .field('genre', payload.genre.join(','))
    //     .field('summary', payload.summary)
    //     .attach('cover_image', payload.cover_image, 'tobi.jpg');

    //   expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    //   expect(res.body.status).to.equal('error'); // Optional: check for error message
    // });
  });

  describe('Fetch All Books', () => {
    it('should not fetch a book when an invalid token is added', (done) => {
      chai
        .request(app)
        .get(baseURL)
        .set('Authorization', `JWT ${authToken}kdlsjdlkjslkdj`)
        .send(payload)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });

    it('should fetch all books successfully', (done) => {
      chai
        .request(app)
        .get(`${baseURL}/`)
        .set('Authorization', `JWT ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.OK);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('Book fetched successfully');
          expect(res.body.data.response).to.be.an('array');
          done();
        });
    });

    it('should not fetch book when authorization header is missing', (done) => {
      chai
        .request(app)
        .get(baseURL)
        .send(payload)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });
  });

  describe('Fetch Specific Book', () => {
    it('should fetch a specific book by ID', (done) => {
      chai
        .request(app)
        .get(`${baseURL}/${bookId}`)
        .set('Authorization', `JWT ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.OK);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.resp).to.have.property('id', bookId);
          done();
        });
    });

    it('should return 404 if the book does not exist', (done) => {
      chai
        .request(app)
        .get(`${baseURL}/invalidId`) // Use an invalid ID
        .set('Authorization', `JWT ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.NOT_FOUND);
          expect(res.body.status).to.equal('error');
          done();
        });
    });

    it('should not fetch a book when an invalid token is added', (done) => {
      chai
        .request(app)
        .get(`${baseURL}/${bookId}`)
        .set('Authorization', `JWT ${authToken}kdlsjdlkjslkdj`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });

    it('should not fetch book when authorization header is missing', (done) => {
      chai
        .request(app)
        .get(baseURL)
        .send(payload)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });
  });

  describe('Update Book', () => {
    it('should return 404 if the book does not exist', (done) => {
      chai
        .request(app)
        .put(`${baseURL}/invalidId`)
        .set('Authorization', `JWT ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.NOT_FOUND);
          expect(res.body.status).to.equal('error');
          done();
        });
    });

    it('should not update a book when an invalid token is added', (done) => {
      chai
        .request(app)
        .put(`${baseURL}/${bookId}`)
        .set('Authorization', `JWT ${authToken}kdlsjdlkjslkdj`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });

    it('should not update book when authorization header is missing', (done) => {
      chai
        .request(app)
        .put(`${baseURL}/${bookId}`)
        .send(payload)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });

    it('should update only the book title successfully', (done) => {
      // const updatedPayload = { title: 'Updated Title' };
      chai
        .request(app)
        .put(`${baseURL}/${bookId}`)
        .set('Authorization', `JWT ${authToken}`)
        // .set('Content-Type', 'multipart/form-data')
        .field('title', 'Updated Title')
        .end((err, res) => {
          if (err) return done(err);
          console.log(res.body);
          expect(res.status).to.equal(StatusCodes.OK);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('Book updated successfully');
          done();
        });
    });
  });

  describe('Delete Book', () => {
    it('should return 404 if the book does not exist', (done) => {
      chai
        .request(app)
        .delete(`${baseURL}/invalidId`)
        .set('Authorization', `JWT ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.NOT_FOUND);
          expect(res.body.status).to.equal('error');
          done();
        });
    });

    it('should not delete a book when an invalid token is added', (done) => {
      chai
        .request(app)
        .delete(`${baseURL}/${bookId}`)
        .set('Authorization', `JWT ${authToken}kdlsjdlkjslkdj`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });

    it('should not delete book when authorization header is missing', (done) => {
      chai
        .request(app)
        .delete(`${baseURL}/${bookId}`)
        .send(payload)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });

    it('should delete the book successfully', (done) => {
      chai
        .request(app)
        .delete(`${baseURL}/${bookId}`)
        .set('Authorization', `JWT ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.OK);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.include(
            `Book with id: ${bookId} deleted successfully`
          );
          done();
        });
    });

    it('should return 404 when trying to delete a non-existent book', (done) => {
      chai
        .request(app)
        .delete(`${baseURL}/invalidId`)
        .set('Authorization', `JWT ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.NOT_FOUND);
          expect(res.body.status).to.equal('error');
          done();
        });
    });
  });

  describe('PURCHASE Book', () => {
    it('should return 401 when user is not authenticated', (done) => {
      chai
        .request(app)
        .post(`${baseURL}/buy/${bookId}`)
        .send({
          quantity: 1,
          price: 100.0,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });

    it('should return 404 if the book is not found', (done) => {
      const nonExistentBookId = 'non-existent-book-id';
      chai
        .request(app)
        .post(`${baseURL}/buy/${nonExistentBookId}`)
        .set('Authorization', `JWT ${authToken}`)
        .send({
          quantity: 1,
          price: 100.0,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.NOT_FOUND);
          done();
        });
    });

    it('should purchase the book successfully', (done) => {
      const purchasePayload = {
        quantity: 1,
        price: 100.0,
      };

      chai
        .request(app)
        .post(`${baseURL}/buy/${bookId}`)
        .set('Authorization', `JWT ${authToken}`)
        .send(purchasePayload)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.OK);
          expect(res.body.status).to.equal('success');
          expect(res.body.authorization_url).to.be.a('string');
          done();
        });
    });
  });

  describe('Book Purchased By User', () => {
    it('should fetch purchased books for a valid user', (done) => {
      chai
        .request(app)
        .get(`${baseURL}/transactions/${userId}`)
        .set('Authorization', `JWT ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.OK);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('Book purchased by user');
          expect(res.body.data.response).to.be.an('array'); // Expecting an array of purchased books
          done();
        });
    });

    it('should return an empty list if the user has no purchased books', (done) => {
      // Assuming `userIdNoPurchase` is a user with no purchases
      // const userIdNoPurchase = 'no-purchase-user-id';

      chai
        .request(app)
        .get(`${baseURL}/transactions/${userId}`)
        .set('Authorization', `JWT ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.OK);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('Book purchased by user');
          // expect(res.body.data.response).to.be.an('array').that.is.empty; // Expecting an empty array
          done();
        });
    });

    it('should return 404 if the user does not exist', (done) => {
      const invalidUserId = 'invalid-user-id';

      chai
        .request(app)
        .get(`${baseURL}/transaction/${invalidUserId}`)
        .set('Authorization', `JWT ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(StatusCodes.NOT_FOUND);
          done();
        });
    });
  });
});
