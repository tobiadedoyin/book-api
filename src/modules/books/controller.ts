import * as dtos from './dto';
import { fnRequest } from '../../shared/types';
import { StatusCodes } from 'http-status-codes';
import bookServices, { BookServices } from './services';
import {
  // ConflictException,
  handleCustomError,
  NotFoundException,
} from '../../shared/errors';
// import { BadException } from '../../shared/errors';

export class BookController {
  constructor(private readonly bookServices: BookServices) {}

  public fetchAllBook: fnRequest = async (_req, res) => {
    const response = await this.bookServices.fetchAllBooks();

    console.log(response);

    return res.status(StatusCodes.OK).json({
      status: 'success',
      StatusCodes: StatusCodes.OK,
      message: 'Book fetched successfully',
      data: {
        response,
      },
    });
  };

  public fetchBook: fnRequest = async (req, res) => {
    const resp = await this.bookServices.fetchBook(req.params.bookId);

    if (resp instanceof NotFoundException) {
      return handleCustomError(res, resp, StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      StatusCodes: StatusCodes.OK,
      message: 'Book fetched successfully',
      data: {
        resp,
      },
    });
  };

  public createBook: fnRequest = async (req, res) => {
    const payload = new dtos.CreateBookDto(req.body);

    if (req.file) {
      payload.cover_image = req.file.buffer;
    }

    const resp = await this.bookServices.createBook(payload);

    return res.status(StatusCodes.CREATED).json({
      status: 'success',
      StatusCodes: StatusCodes.CREATED,
      message: 'Book created successfully',
      data: resp,
    });
  };

  public updateBook: fnRequest = async (req, res) => {
    const resp = await this.bookServices.fetchBook(req.params.id);
    if (resp instanceof NotFoundException) {
      return handleCustomError(res, resp, StatusCodes.NOT_FOUND);
    }
    const fetchBookPayload = new dtos.CreateBookDto(req.body);

    if (req.file) {
      fetchBookPayload.cover_image = req.file.buffer;
    }

    await this.bookServices.updateBook(req.params.bookId, fetchBookPayload);

    return res.status(StatusCodes.OK).json({
      status: 'success',
      StatusCodes: StatusCodes.OK,
      message: 'Book updated successfully',
    });
  };

  public deleteBook: fnRequest = async (req, res) => {
    const resp = await this.bookServices.fetchBook(req.params.bookId);

    if (resp instanceof NotFoundException) {
      return handleCustomError(res, resp, StatusCodes.NOT_FOUND);
    }

    const response = await this.bookServices.deleteBook(req.params.bookId);

    return res.status(StatusCodes.OK).json({
      status: 'success',
      StatusCodes: StatusCodes.OK,
      message: `Book with id: ${response} deleted successfully`,
    });
  };

  public purchaseBook: fnRequest = async (req, res) => {
    const payload = new dtos.purchaseBookDto(req.body);
    const { user } = req;
    const { bookId } = req.params;

    const resp = await this.bookServices.fetchBook(bookId);

    if (resp instanceof NotFoundException) {
      return handleCustomError(res, resp, StatusCodes.NOT_FOUND);
    }

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'fail',
        StatusCodes: StatusCodes.UNAUTHORIZED,
        message: 'User not authenticated',
      });
    }

    const response = await this.bookServices.purchaseBook(
      bookId,
      user,
      payload
    );

    return res.status(StatusCodes.OK).json({
      status: 'success',
      StatusCodes: StatusCodes.OK,
      authorization_url: response,
    });
  };

  public verifyBookPurchase: fnRequest = async (req, res) => {
    const { reference } = req.params;

    await this.bookServices.verifyBookPurchase(reference);

    return res.status(StatusCodes.OK).json({
      status: 'success',
      StatusCodes: StatusCodes.OK,
      message: `payment successful`,
    });
  };

  public fetchBookPurchased: fnRequest = async (req, res) => {
    const response = await this.bookServices.fetchBookPurchased(
      req.params.userId
    );

    return res.status(StatusCodes.OK).json({
      status: 'success',
      StatusCodes: StatusCodes.OK,
      message: 'Book purchased by user',
      data: {
        response,
      },
    });
  };
}

const customerController = new BookController(bookServices);

export default customerController;
