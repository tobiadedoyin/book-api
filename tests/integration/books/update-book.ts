import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/config/express';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { loginAndGetToken } from './create-book';

chai.use(chaiHttp);

const baseURL = '/api/v1/books';

describe('BookController UpdateBook', () => {
  let storedBookId = '';
  let authToken: string = '';

  before(async () => {
    try {
      authToken = await loginAndGetToken();

      // Seed a new book into the system
      const createBookPayload = {
        title: faker.lorem.words(3),
        authors: [faker.person.fullName()],
        publisher: faker.company.name(),
        published: faker.date.past({ years: 5 }).toISOString().split('T')[0],
        genre: [faker.music.genre()],
        summary: faker.lorem.sentences(3),
      };

      const res = await chai
        .request(app)
        .post(baseURL)
        .set('Authorization', `Bearer ${authToken}`)
        .send(createBookPayload);

      expect(res.status).to.equal(StatusCodes.CREATED);
      storedBookId = res.body.data.id; // Assuming the created book ID is in this path
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  });

  it('should not update a book when an invalid token is added', async () => {
    const response = await chai
      .request(app)
      .put(`${baseURL}/${storedBookId}`)
      .send({
        token: 'invalid_token', // Simulating an invalid token
        body: {
          title: 'New Title',
          authors: [faker.person.fullName()],
        },
      });

    expect(response.status).to.equal(StatusCodes.UNAUTHORIZED); // Ensure correct status for unauthorized
  });

  it('should update a book when authorized', async () => {
    const updatePayload = {
      title: faker.lorem.words(3),
      authors: [faker.person.fullName()],
      publisher: faker.company.name(),
      published: faker.date.past({ years: 5 }).toISOString().split('T')[0],
      genre: [faker.music.genre()],
      summary: faker.lorem.sentences(3),
    };

    const response = await chai
      .request(app)
      .put(`${baseURL}/${storedBookId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatePayload);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.body.message).to.equal('Book updated successfully');
    expect(response.body.data).to.include({
      title: updatePayload.title,
      publisher: updatePayload.publisher,
      summary: updatePayload.summary,
    });
  });

  it('should not update a book with a nonexistent bookId', async () => {
    const nonexistentId = faker.string.uuid();
    const response = await chai
      .request(app)
      .put(`${baseURL}/${nonexistentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Nonexistent Book',
        authors: [faker.person.fullName()],
      });

    expect(response.status).to.equal(StatusCodes.NOT_FOUND);
    expect(response.body.status).to.equal('error');
    expect(response.body.message).to.equal('Book not found'); // Adjust the message according to your controller's response
  });
});
