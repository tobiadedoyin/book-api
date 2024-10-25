import { BaseEntity } from '../../shared/utils/base-entity';

export class CreateBookDto extends BaseEntity<CreateBookDto> {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  published: string;
  genre: string[];
  summary?: string;
  cover_image?: Buffer;
}

export class purchaseBookDto extends BaseEntity<purchaseBookDto> {
  user_id: string;
  email: string;
  username: string;
  book_id: string;
  amount: number;
  purchase_status: string;
  reference: string;
  callback_url: string;
}
