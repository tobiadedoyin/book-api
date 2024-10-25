import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { describe, it } from 'mocha';
import request from 'supertest';
import app from '../../../src/config/express';

const baseUrl = '/api/v1/auth';

describe('Authentication', () => {
  it('should successfully create user', (done) => {
    const payload = {
      username: 'hamid',
      password: 'Password@1',
    };

    request(app)
      .post(`${baseUrl}/register`)
      .send(payload)
      .end((_err, response) => {
        expect(response.status).to.equal(StatusCodes.OK);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('User registered successfully');
        done();
      });
  });

  it('should not register user if username already exists', (done) => {
    const payload = {
      username: 'hamid',
      password: 'Password@1',
    };

    request(app)
      .post(`${baseUrl}/register`)
      .send(payload)
      .end((_err, response) => {
        expect(response.status).to.equal(StatusCodes.CONFLICT);
        expect(response.body.status).to.equal('error');
        expect(response.body.message).to.equal('User already exists');
        done();
      });
  });

  it('should login user if account is verified', (done) => {
    const payload = {
      username: 'hamid',
      password: 'Password@1',
    };

    request(app)
      .post(`${baseUrl}/login`)
      .send(payload)
      .end((_err, response) => {
        expect(response.status).to.equal(StatusCodes.OK);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('User logged in successfully');
        done();
      });
  });
});
