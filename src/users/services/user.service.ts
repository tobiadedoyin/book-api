import { CreateUserArgs, UserRepository } from '../repositories/user.interface';
import { UserEntity } from '../entities/user.entity';
import userRepository from '../repositories/user.repositories';

export interface UserService {
  createUser(data: CreateUserArgs): Promise<UserEntity>;
  getUserId(id: string): Promise<UserEntity>;
  getUserByEmail(email: string): Promise<UserEntity>;
  getUserByPhoneNumber(phone_number: string): Promise<UserEntity>;
  deleteUser(id: string): Promise<UserEntity | null>;
}

export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(data: CreateUserArgs): Promise<UserEntity> {
    return this.userRepository.createUser(data);
  }

  public async getUserId(id: string): Promise<UserEntity> {
    return this.userRepository.findUserById(id);
  }

  public async getUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findUserByEmail(email);
  }
  public getUserByPhoneNumber(phone_number: string): Promise<UserEntity> {
    return this.userRepository.findUserByPhoneNumber(phone_number);
  }

  public async deleteUser(id: string): Promise<UserEntity | null> {
    return this.userRepository.deleteUser(id);
  }
}

const userService: UserService = new UserServiceImpl(userRepository);

export default userService;
