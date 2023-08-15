import { BaseEntity } from '../../shared/utils/base-entity';
import { UserProfileEntity } from './user-profile.entity';

export class UserEntity extends BaseEntity<UserEntity> {
  id: string;
  email: string | null;
  is_email_verified: boolean;
  phone_number: string | null;
  password: string | null;
  created_at: Date;
  updated_at: Date;
  profileInfo?: Omit<UserProfileEntity, 'user_id'>;
}
