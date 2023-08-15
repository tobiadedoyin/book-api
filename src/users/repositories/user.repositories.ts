import { CreateUserArgs, UserRepository } from './user.interface';
import { UserEntity } from '../entities/user.entity';
import { sqlQuest } from '../../config/database';
import { SqlQuest } from '@bitreel/sql-quest';
import Deasyncify from 'deasyncify';
import { CreateNullClass } from '../../shared/utils/null-class';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly sqlQuest: SqlQuest) {}

  public async createUser({
    is_email_verified = false,
    password,
    first_name,
    last_name,
    email,
    phone_number,
    address,
  }: CreateUserArgs): Promise<UserEntity> {
    // insert into db with sqlQuest
    const user = await this.sqlQuest.one(
      `WITH instance_user AS (
       INSERT
       INTO users(email, phone_number, is_email_verified, password)
       VALUES ($(email), $(phone_number), $(is_email_verified), $(password))
           RETURNING *
           ), current_profile AS (
       INSERT
       INTO users_profile(email, phone_number, user_id, first_name, last_name, address)
       SELECT email, phone_number, id, $(first_name), $(last_name), $(address)
       FROM instance_user
           RETURNING *
           )
      SELECT instance_user.id           as id,
             instance_user.email        as email,
             instance_user.phone_number as phone_number,
             instance_user.created_at as created_at,
             instance_user.updated_at as updated_at,
             current_profile.first_name as first_name,
             current_profile.last_name  as last_name,
             current_profile.address    as address,
             current_profile.id         as profile_id,
             current_profile.created_at as profile_created_at,
             current_profile.updated_at as profile_updated_at
      FROM instance_user
               FULL JOIN current_profile
                         ON instance_user.id = current_profile.user_id;`,

      {
        email,
        password,
        is_email_verified,
        phone_number,
        first_name,
        last_name,
        address,
      },
    );

    return new UserEntity({
      id: user.id,
      email: user.email,
      is_email_verified: user.is_email_verified,
      phone_number: user.phone_number,
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at),
      profileInfo: {
        id: user.profile_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        created_at: new Date(user.profile_created_at),
        updated_at: new Date(user.profile_updated_at),
      },
    });
  }

  public async findUserByEmail(email: string): Promise<UserEntity> {
    const [user, err] = await Deasyncify.watch(
      this.sqlQuest.one('SELECT * FROM users WHERE email = $1', [email]),
    );

    if (err != null) {
      if (err?.code == 0) {
        return CreateNullClass<UserEntity>();
      }

      throw err;
    }

    return new UserEntity({
      id: user.id,
      email: user.email,
      password: user.password,
      is_email_verified: user.is_email_verified,
      phone_number: user.phone_number,
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at),
    });
  }

  public async findUserByPhoneNumber(
    phone_number: string,
  ): Promise<UserEntity> {
    const [user, err] = await Deasyncify.watch(
      this.sqlQuest.one('SELECT * FROM USERS WHERE phone_number = $1', [
        phone_number,
      ]),
    );

    if (err != null) {
      if (err?.code == 0) {
        return CreateNullClass<UserEntity>();
      }

      throw err;
    }

    return new UserEntity({
      id: user.id,
      email: user.email,
      password: user.password,
      is_email_verified: user.is_email_verified,
      phone_number: user.phone_number,
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at),
    });
  }
  public async findUserById(id: string): Promise<UserEntity> {
    const [user, err] = await Deasyncify.watch(
      this.sqlQuest.one('SELECT * FROM users WHERE id = $1', [id]),
    );

    if (err != null) {
      if (err?.code == 0) {
        return CreateNullClass<UserEntity>();
      }
      return err;
    }

    return new UserEntity({
      id: user.id,
      email: user.email,
      password: user.password,
      is_email_verified: user.is_email_verified,
      phone_number: user.phone_number,
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at),
    });
  }

  public async deleteUser(id: string): Promise<UserEntity | null> {
    const [user, err] = await Deasyncify.watch(
      this.sqlQuest.one('DELETE FROM users WHERE id = $1 RETURNING *', [id]),
    );

    if (err != null) {
      if (err?.code == 0) {
        return CreateNullClass<UserEntity>();
      }
      throw err;
    }

    return new UserEntity({
      id: user.id,
      email: user.email,
      password: user.password,
      is_email_verified: user.is_email_verified,
      phone_number: user.phone_number,
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at),
    });
  }
}

const userRepository: UserRepository = new UserRepositoryImpl(sqlQuest);

export default userRepository;
