import { BaseEntity } from '../../shared/utils/base-entity';

export class UserDto extends BaseEntity<UserDto> {
  id: string;
  username: string;
  password: string;
}
