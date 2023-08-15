import { UserEntity } from '../entities/user.entity';
import { UserProfileEntity } from '../entities/user-profile.entity';

export type CreateUserArgs = Partial<
  Omit<UserEntity, 'id' | 'created_at' | 'updated_at' | 'profileInfo'> &
    Omit<UserProfileEntity, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>;

export interface UserRepository {
  createUser(user: CreateUserArgs): Promise<UserEntity>;

  findUserById(id: string): Promise<UserEntity>;

  findUserByEmail(email: string): Promise<UserEntity>;

  deleteUser(id: string): Promise<UserEntity | null>;

  findUserByPhoneNumber(phone_number: string): Promise<UserEntity>;
}
