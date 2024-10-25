import { Router } from 'express';
import bookController from './controller';
import { WatchAsyncController } from '../../shared/utils/watch-async-controller';
import ImageUploadMiddleware from '../../shared/middlewares/multer.middleware';
import { authenticateUser } from '../../shared/middlewares/auth.middleware';

const bookRouter = Router();

bookRouter.get(
  '/',
  authenticateUser,
  WatchAsyncController(bookController.fetchAllBook)
);

bookRouter.get(
  '/:bookId',
  authenticateUser,
  WatchAsyncController(bookController.fetchBook)
);

bookRouter.post(
  '/',
  authenticateUser,
  ImageUploadMiddleware,
  WatchAsyncController(bookController.createBook)
);

bookRouter.put(
  '/:bookId',
  authenticateUser,
  ImageUploadMiddleware,
  WatchAsyncController(bookController.updateBook)
);

bookRouter.delete(
  '/:bookId',
  authenticateUser,
  WatchAsyncController(bookController.deleteBook)
);

bookRouter.post(
  '/buy/:bookId',
  authenticateUser,
  WatchAsyncController(bookController.purchaseBook)
);

bookRouter.post(
  '/verify-purchase/:reference',
  authenticateUser,
  WatchAsyncController(bookController.verifyBookPurchase)
);

bookRouter.get(
  '/transactions/:userId',
  authenticateUser,
  WatchAsyncController(bookController.fetchBookPurchased)
);
export default bookRouter;
