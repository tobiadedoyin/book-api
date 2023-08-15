import userService, { UserService } from './services/user.service';
import { Request, Response } from 'express';

export class UserController {
  constructor(private readonly userService: UserService) {}

  public getUser = async (req: Request, res: Response) => {
    const user = (req as any).account;

    res.status(200).json(user);
  };

  public updateUser = async (_req: Request, _res: Response) => {
    this.userService;
  };
}

const userController = new UserController(userService);

export default userController;
