import { BaseEntity } from '../../shared/utils/base-entity';

export class UserProfileEntity extends BaseEntity<UserProfileEntity> {
  id: string;
  email: string | null;
  phone_number: string | null;
  first_name: string | null;
  last_name: string | null;
  address: string | null;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
