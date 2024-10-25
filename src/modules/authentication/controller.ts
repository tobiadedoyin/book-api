import * as dtos from './dto';
import authServices, { AuthServices } from './services';
import { fnRequest } from '../../shared/types';
import { StatusCodes } from 'http-status-codes';
import {
  ConflictException,
  UnAuthorizedException,
  handleCustomError,
} from '../../shared/errors';
import { SignedData } from '../../shared/interfaces';
import hashingService, {
  HashingService,
} from '../../shared/services/hashing/hashing.service';

export class AuthController {
  constructor(
    private readonly authServices: AuthServices,
    private readonly hashingService: HashingService
  ) {}

  public createUser: fnRequest = async (req, res) => {
    const payload = new dtos.UserDto(req.body);
    const resp = await this.authServices.createUser(payload);

    if (resp instanceof ConflictException) {
      return handleCustomError(res, resp, StatusCodes.CONFLICT);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      Statuscode: StatusCodes.OK,
      message: 'User registered successfully',
    });
  };

  public login: fnRequest = async (req, res) => {
    const payload = new dtos.UserDto(req.body);

    const resp = await this.authServices.validateUser(
      payload.username,
      payload.password
    );

    if (resp instanceof UnAuthorizedException) {
      return handleCustomError(res, resp, StatusCodes.UNAUTHORIZED);
    }

    const signedData: SignedData = {
      id: resp.id,
      username: resp.username,
    };

    const token = await this.hashingService.sign(signedData);

    return res.status(StatusCodes.OK).json({
      status: 'success',
      Statuscode: StatusCodes.OK,
      message: 'User logged in successfully',
      data: { user: signedData, token },
    });
  };
}

const authController = new AuthController(authServices, hashingService);

export default authController;
