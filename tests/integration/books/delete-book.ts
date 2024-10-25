import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/config/express';
import { StatusCodes } from 'http-status-codes';
import { expect } from 'chai';
import { loginAndGetToken } from './create-book'; // Assuming this function exists to log in and get a token

chai.use(chaiHttp);

const baseURL = '/api/v1/books';

describe('BookController -> Delete Book Tests', () => {
  let authToken: string = '';
  let storedBookId: string = '';

  before(async () => {
    try {
      authToken = await loginAndGetToken(); // Log in and get the token

      // Seed a new book into the system for testing deletion
      const createBookPayload = {
        title: 'Test Book',
        authors: ['Test Author'],
        publisher: 'Test Publisher',
        published: '2020-01-01',
        genre: ['Fiction'],
        summary: 'This is a test book.',
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

  it('should delete a book successfully when authorized', async () => {
    const res = await chai
      .request(app)
      .delete(`${baseURL}/${storedBookId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).to.equal(StatusCodes.OK);
    expect(res.body.message).to.equal('Book deleted successfully');
  });

  it('should return unauthorized when an invalid token is provided', async () => {
    const res = await chai
      .request(app)
      .delete(`${baseURL}/${storedBookId}`)
      .set('Authorization', `Bearer invalid_token`);

    expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
    expect(res.body.status).to.equal('error');
  });

  it('should return 404 when trying to delete a nonexistent book', async () => {
    const nonExistentBookId = '7654356789'; // Assuming this ID does not exist
    const res = await chai
      .request(app)
      .delete(`${baseURL}/${nonExistentBookId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).to.equal(StatusCodes.NOT_FOUND);
    expect(res.body.status).to.equal('error');
    expect(res.body.message).to.equal('Book not found'); // Adjust the message according to your controller's response
  });
});
