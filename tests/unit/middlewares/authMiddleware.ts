import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response, NextFunction } from 'express';
import { authenticateUser } from '../../../src/shared/middlewares/auth.middleware';
import hashingService from '../../../src/shared/services/hashing/hashing.service';
// import AuthServices from '../../../src/modules/authentication/services';
import {
  UnAuthorizedException,
  // NotFoundException,
} from '../../../src/shared/errors/index';

describe('authenticateUser Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: sinon.SinonSpy;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {};
    mockNext = sinon.spy();
  });

  it('should throw an UnAuthorizedException when no authorization header is provided', async () => {
    await authenticateUser(
      mockReq as Request,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(mockNext.calledOnce).to.be.true;
    const error = mockNext.getCall(0).args[0];
    expect(error).to.be.instanceOf(UnAuthorizedException);
    expect(error.message).to.equal('No authorization header provided');
  });

  it('should throw an UnAuthorizedException for an invalid header format', async () => {
    mockReq.headers = mockReq.headers || {};
    mockReq.headers.authorization = 'BearerInvalidTokenFormat';

    await authenticateUser(
      mockReq as Request,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(mockNext.calledOnce).to.be.true;
    const error = mockNext.getCall(0).args[0];
    expect(error).to.be.instanceOf(UnAuthorizedException);
    expect(error.message).to.equal('Invalid authorization header format');
  });

  it('should throw an UnAuthorizedException if token is invalid or expired', async () => {
    mockReq.headers = mockReq.headers || {};
    mockReq.headers.authorization = 'JWT invalidtoken';

    const verifyStub = sinon
      .stub(hashingService, 'verify')
      .throws(new Error('Invalid token'));

    await authenticateUser(
      mockReq as Request,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(mockNext.calledOnce).to.be.true;
    const error = mockNext.getCall(0).args[0];
    expect(error).to.be.instanceOf(UnAuthorizedException);
    expect(error.message).to.equal('Invalid or expired token');

    verifyStub.restore();
  });

  // it('should throw an UnAuthorizedException if token payload is invalid', async () => {
  //   mockReq.headers = mockReq.headers || {};
  //   mockReq.headers = mockReq.headers || {};
  //   mockReq.headers = mockReq.headers || {};
  //   mockReq.headers = mockReq.headers || {};
  //   mockReq.headers = mockReq.headers || {};
  //   mockReq.headers = mockReq.headers || {};
  //   mockReq.headers = mockReq.headers || {};
  //   mockReq.headers = mockReq.headers || {};
  //   mockReq.headers = mockReq.headers || {};
  //   mockReq.headers = mockReq.headers || {};
  //   mockReq.headers.authorization = 'JWT validtoken';

  //   const verifyStub = sinon.stub(hashingService, 'verify').returns({} as any); // No id in payload

  //   await authenticateUser(
  //     mockReq as Request,
  //     mockRes as Response,
  //     mockNext as NextFunction
  //   );

  //   expect(mockNext.calledOnce).to.be.true;
  //   const error = mockNext.getCall(0).args[0];
  //   expect(error).to.be.instanceOf(UnAuthorizedException);
  //   expect(error.message).to.equal('Invalid token payload');

  //   verifyStub.restore();
  // });

  // it('should throw an UnAuthorizedException if user does not exist', async () => {
  //   mockReq.headers.authorization = 'JWT validtoken';

  //   const verifyStub = sinon
  //     .stub(hashingService, 'verify')
  //     .returns({ id: '123' } as any);
  //   const getUserStub = sinon
  //     .stub(AuthServices, 'getUser')
  //     .resolves(new NotFoundException());

  //   await authenticateUser(
  //     mockReq as Request,
  //     mockRes as Response,
  //     mockNext as NextFunction
  //   );

  //   expect(mockNext.calledOnce).to.be.true;
  //   const error = mockNext.getCall(0).args[0];
  //   expect(error).to.be.instanceOf(UnAuthorizedException);
  //   expect(error.message).to.equal('user does not exist');

  //   verifyStub.restore();
  //   getUserStub.restore();
  // });

  // it('should attach user to request if token and user are valid', async () => {
  //   mockReq.headers.authorization = 'JWT validtoken';

  //   const user = { id: '123', name: 'Tobi' };
  //   const verifyStub = sinon
  //     .stub(hashingService, 'verify')
  //     .returns({ id: '123' } as any);
  //   const getUserStub = sinon.stub(AuthServices, 'getUser').resolves(user);

  //   await authenticateUser(
  //     mockReq as Request,
  //     mockRes as Response,
  //     mockNext as NextFunction
  //   );

  //   expect(mockNext.calledOnce).to.be.true;
  //   expect(mockNext.calledWithExactly()).to.be.true; // No errors
  //   expect(mockReq.user).to.deep.equal(user); // Ensure user is attached to request

  //   verifyStub.restore();
  //   getUserStub.restore();
  // });
});
