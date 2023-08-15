import { BaseEntity } from '../../shared/utils/base-entity';

export class LoginDto extends BaseEntity<LoginDto> {
  email: string;
  phone_number: string;
  password: string;
}
