import { BaseEntity } from '../../shared/utils/base-entity';

export class UserEntity extends BaseEntity<UserEntity> {
  id: string;
  username: string;
  password: string;
}
