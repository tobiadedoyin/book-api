import { Request, Response } from 'express';
import userService, { UserService } from '../users/services/user.service';
import Logger from '../config/logger';
import { LoginDto } from './dtos/login.dto';
import { LOGIN_MODE } from '../shared/enums';
import { BadException, InternalServerErrorException } from '../shared/errors';
import { SessionAccount } from '../shared/types';
import { SignupDto } from './dtos/signup.dto';
import hashingService, {
  HashingService,
} from '../shared/services/hashing/hashing.service';

export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  private createSession(req: Request) {
    return (sessionUser: SessionAccount) => {
      (req.session as unknown as { account: SessionAccount })['account'] =
        sessionUser;

      return req.session.save((err) => {
        if (err != null) {
          this.logger.error(err);
          throw new InternalServerErrorException(
            'There was an error creating a session',
          );
        }
      });
    };
  }

  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
  ) {}

  public login = async (req: Request, res: Response): Promise<void> => {
    this.logger.log('OBTAINING LOGIN MODE');

    const mode = req.query['mode'];
    const loginPayload = new LoginDto(req.body);

    this.logger.log(`LOGIN MODE: ${mode}`);

    if (mode === LOGIN_MODE.EMAIL) {
      this.logger.log('Querying for user with given email');
      const user = await this.userService.getUserByEmail(loginPayload.email);

      if (user == null) {
        this.logger.log('No user found with give email');

        throw new BadException('Invalid email');
      }

      const doesPasswordMatch = await this.hashingService.compare(
        loginPayload.password,
        user.password as string,
      );

      if (!doesPasswordMatch) {
        this.logger.log('password is incorrect');

        throw new BadException('Incorrect password');
      }

      this.createSession(req)({ id: user.id });

      res.sendStatus(200);

      return;
    }

    if (mode === LOGIN_MODE.PHONE) {
      this.logger.log('Querying for user with given phone number');
      const user = await this.userService.getUserByPhoneNumber(
        loginPayload.phone_number,
      );

      if (user == null) {
        this.logger.log('No user found with given phone number');

        throw new BadException('Invalid phone number');
      }

      const doesPasswordMatch = await this.hashingService.compare(
        loginPayload.password,
        user.password as string,
      );

      if (!doesPasswordMatch) {
        this.logger.log('password is incorrect');

        throw new BadException('Incorrect password');
      }

      this.createSession(req)({ id: user.id });

      res.sendStatus(200);

      return;
    }
  };

  public signup = async (req: Request, res: Response) => {
    const signupPayload = new SignupDto(req.body);

    const userWithEmail = await this.userService.getUserByEmail(
      signupPayload.email,
    );

    if (userWithEmail != null) {
      throw new BadException('Email has already been used');
    }

    const userWithPhoneNumber = await this.userService.getUserByPhoneNumber(
      signupPayload.phone_number,
    );

    if (userWithPhoneNumber != null) {
      throw new BadException('Phone Number has already been used');
    }

    const hashedPassword = await this.hashingService.hash(
      signupPayload.password,
    );

    const newlyCreatedUser = await this.userService.createUser({
      email: signupPayload.email,
      phone_number: signupPayload.phone_number,
      first_name: signupPayload.first_name,
      last_name: signupPayload.last_name,
      password: hashedPassword,
    });

    res.status(200).json(newlyCreatedUser);
  };

  public demo = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: 'hello' });
  };
}

const authenticationController = new AuthenticationController(
  userService,
  hashingService,
);

export default authenticationController;
