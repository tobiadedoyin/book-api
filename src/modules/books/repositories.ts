import { NotFoundException } from '../../shared/errors';
import * as bookParams from './entities';
import { db } from '../../config/database';
import bookQueries from './query';

export interface BookRepository {
  createBook(params: bookParams.BookEntity): Promise<string>;
  fetchBook(param: string): Promise<bookParams.BookEntity | NotFoundException>;
  updateBook(
    params: Partial<bookParams.BookEntity>
  ): Promise<bookParams.BookEntity>;
  deleteBook(param: string): Promise<string>;
  fetchAllBooks(): Promise<bookParams.BookEntity[]>;
  purchaseBook(
    params: bookParams.purchaseBookEntity
  ): Promise<bookParams.purchaseBookEntity>;
  updatePaymentStatus(
    param: string,
    search: string
  ): Promise<bookParams.purchaseBookEntity | NotFoundException>;
  fetchPurchasedBook(
    param: string
  ): Promise<bookParams.purchaseBookEntity[] | NotFoundException>;
}

export class BookRepositoryImpl implements BookRepository {
  public async createBook(params: bookParams.BookEntity): Promise<string> {
    return await db.one(bookQueries.createBook, params);
  }

  public async fetchAllBooks(): Promise<bookParams.BookEntity[]> {
    const books = await db.manyOrNone(bookQueries.getAllBook);
    return books.map((book) => new bookParams.BookEntity({ ...book }));
  }

  public async fetchBook(
    param: string
  ): Promise<bookParams.BookEntity | NotFoundException> {
    const book = await db.oneOrNone(bookQueries.getBook, [param]);
    if (!book) {
      return new NotFoundException('Book not found');
    }
    return book;
  }

  public async updateBook(
    params: Partial<bookParams.BookEntity>
  ): Promise<bookParams.BookEntity> {
    const updatedBook = await db.one(bookQueries.updateBook, params);
    return updatedBook;
  }

  public async deleteBook(searchParam: string): Promise<string> {
    await db.one(bookQueries.deleteBook, [searchParam]);
    return searchParam;
  }

  public async purchaseBook(
    params: bookParams.purchaseBookEntity
  ): Promise<bookParams.purchaseBookEntity> {
    console.log('>>>>>2', params);
    return await db.one(bookQueries.purchaseBook, params);
  }

  public async updatePaymentStatus(
    searchParam: string,
    params: string
  ): Promise<bookParams.purchaseBookEntity | NotFoundException> {
    return db.tx(async (t) => {
      const purchasedBook = await t.oneOrNone(bookQueries.fetchPurchasedBooks, [
        searchParam,
      ]);
      console.log('>>>>>>>>', purchasedBook);
      if (purchasedBook instanceof NotFoundException) {
        throw new NotFoundException('Purchased Book not found');
      }

      const updatedPaymentStatus = await t.oneOrNone(
        bookQueries.updatePurchaseStatus,
        {
          reference: searchParam,
          purchase_status: params,
        }
      );

      return updatedPaymentStatus;
    });
  }

  public async fetchPurchasedBook(
    param: string
  ): Promise<bookParams.purchaseBookEntity[] | NotFoundException> {
    const purchasedBooks = await db.any(bookQueries.fetchPurchasedBooks, [
      param,
    ]);

    if (purchasedBooks.length === 0) {
      throw new NotFoundException('No purchase records found for this book');
    }

    return purchasedBooks;
  }
}

const bookRepository = new BookRepositoryImpl();

export default bookRepository;
