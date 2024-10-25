import { NotFoundException } from '../../shared/errors';
import { db } from '../../config/database';
import * as authParams from './entities';
import authQueries from './query';

export interface AuthRepository {
  createUser(params: authParams.UserEntity): Promise<void>;
  getUser(param: string): Promise<authParams.UserEntity | NotFoundException>;
}

export class AuthRepositoryImpl implements AuthRepository {
  public async createUser(params: authParams.UserEntity): Promise<void> {
    return db.tx(async (t) => {
      const createUser = await t.one(authQueries.createUser, params);

      await t.batch([createUser]);
    });
  }

  public async getUser(
    param: string
  ): Promise<authParams.UserEntity | NotFoundException> {
    const user = await db.oneOrNone(authQueries.getUser, [param]);

    if (!user) {
      return new NotFoundException('User not found');
    }

    return new authParams.UserEntity({
      id: user.id,
      username: user.username,
      password: user.password,
    });
  }
}

const authRepository = new AuthRepositoryImpl();

export default authRepository;
