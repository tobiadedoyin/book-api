import { BaseEntity } from '../../shared/utils/base-entity';

export class BookEntity extends BaseEntity<BookEntity> {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  published: string;
  genre: string[];
  summary?: string;
  cover_image?: Buffer;
}

export class purchaseBookEntity extends BaseEntity<purchaseBookEntity> {
  user_id: string;
  email: string;
  username: string;
  book_id: string;
  amount: number;
  purchase_status: string;
  reference: string;
  callback_url: string;
}
