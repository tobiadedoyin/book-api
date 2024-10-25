import bookRepository, { BookRepository } from './repositories';
import * as bookParams from './entities';
import {
  // BadException,
  // ConflictException,
  NotFoundException,
} from '../../shared/errors';
import { SignedData } from '../../shared/interfaces';
import dotenv from 'dotenv';
import { initializePayment, verifyTransaction } from '../../shared/utils/axios';
dotenv.config();

export interface BookServices {
  createBook(params: bookParams.BookEntity): Promise<string>;
  updateBook(
    searchParam: string,
    params: Partial<bookParams.BookEntity>
  ): Promise<bookParams.BookEntity>;
  deleteBook(searchParam: string): Promise<string>;
  fetchAllBooks(): Promise<bookParams.BookEntity[]>;
  fetchBook(
    searchParam: string
  ): Promise<bookParams.BookEntity | NotFoundException>;
  purchaseBook(
    searchParam: string,
    user: SignedData,
    params: bookParams.purchaseBookEntity
  ): Promise<string | NotFoundException>;
  verifyBookPurchase(searchParam: string): Promise<void>;
  fetchBookPurchased(
    searchParam: string
  ): Promise<bookParams.purchaseBookEntity[] | NotFoundException>;
}

export class BookServiceImpl implements BookServices {
  constructor(private readonly bookRepository: BookRepository) {}

  public async fetchBook(
    param: string
  ): Promise<bookParams.BookEntity | NotFoundException> {
    const response = await this.bookRepository.fetchBook(param);

    if (response instanceof NotFoundException) {
      return new NotFoundException(`Book not found`);
    }

    return response;
  }

  public async fetchAllBooks(): Promise<bookParams.BookEntity[]> {
    return this.bookRepository.fetchAllBooks();
  }

  public async createBook(params: bookParams.BookEntity): Promise<string> {
    return await this.bookRepository.createBook(params);
  }

  public async updateBook(
    searchParam: string,
    params: Partial<bookParams.BookEntity>
  ): Promise<bookParams.BookEntity> {
    const existingBook = await this.fetchBook(searchParam);

    if (existingBook instanceof NotFoundException) {
      throw new NotFoundException(`Book with id: ${searchParam} not found`);
    }

    const updateParams = {
      id: searchParam,
      title: params.title ?? existingBook.title,
      authors: params.authors ?? existingBook.authors,
      publisher: params.publisher ?? existingBook.publisher,
      published: params.published ?? existingBook.published,
      genre: params.genre ?? existingBook.genre,
      summary: params.summary ?? existingBook.summary,
      cover_image: params.cover_image ?? existingBook.cover_image,
    };

    const response = await this.bookRepository.updateBook(updateParams);

    if (!response) {
      throw new NotFoundException(`Failed to update book`);
    }
    return response;
  }

  public async deleteBook(searchParam: string): Promise<string> {
    const response = await this.bookRepository.deleteBook(searchParam);
    return response;
  }

  public async purchaseBook(
    searchParam: string,
    user: SignedData,
    params: bookParams.purchaseBookEntity
  ): Promise<string | NotFoundException> {
    const book = await this.fetchBook(searchParam);

    if (book instanceof NotFoundException) {
      return book;
    }

    const paystackPayload = {
      email: 'oladeletobiadedoyin@gmail.com',
      username: user.username,
      amount: params.amount * 100,
      reference: `BOOK_REFERENCE_${book.id}_${new Date().getTime()}`,
      callback_url:
        'https://de8f-102-88-69-254.ngrok-free.app/api/v1/books/verify-payment',
    };
    console.log('>>>>>>', paystackPayload);

    const response = await initializePayment(paystackPayload);

    const purchasePayload = {
      user_id: user.id,
      book_id: book.id ?? searchParam,
      purchase_status: 'pending',
      ...paystackPayload,
    };

    await this.bookRepository.purchaseBook(purchasePayload);

    return response;
  }

  public async verifyBookPurchase(searchParam: string): Promise<void> {
    const response = await verifyTransaction(searchParam);

    if (response.status === 'success') {
      await bookRepository.updatePaymentStatus(searchParam, 'completed');
    }
  }

  fetchBookPurchased(
    searchParam: string
  ): Promise<bookParams.purchaseBookEntity[] | NotFoundException> {
    return this.bookRepository.fetchPurchasedBook(searchParam);
  }
}

const bookServices = new BookServiceImpl(bookRepository);

export default bookServices;
