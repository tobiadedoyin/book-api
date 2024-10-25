import { expect } from 'chai';
// import sinon from 'sinon';
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import ImageUploadMiddleware from '../../../src/shared/middlewares/multer.middleware';

describe('ImageUploadMiddleware', () => {
  const app = express();
  app.post(
    '/upload',
    (req: Request, res: Response, next: NextFunction) => {
      ImageUploadMiddleware(req, res, next);
    },
    (_req: Request, res: Response) => {
      res.status(200).send({ message: 'Upload successful' });
    }
  );

  it('should allow valid image files', (done) => {
    request(app)
      .post('/upload')
      .attach('cover_image', Buffer.from('valid image content'), 'image.jpg')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).to.equal('Upload successful');
      })
      .end(done);
  });

  it('should return 400 for files exceeding the size limit', (done) => {
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024);

    request(app)
      .post('/upload')
      .attach('cover_image', largeBuffer, 'large_image.jpg')
      .expect(400)
      .expect((res) => {
        expect(res.body.error).to.equal('File too large');
      })
      .end(done);
  });

  it('should return 400 for invalid file extensions', (done) => {
    request(app)
      .post('/upload')
      .attach('cover_image', Buffer.from('content'), 'invalid_file.txt')
      .expect(400)
      .expect((res) => {
        expect(res.body.error).to.equal(
          'Only image files with .jpg, .jpeg, .png, or .svg extensions are allowed!'
        );
      })
      .end(done);
  });

  it('should proceed without file if file is optional', (done) => {
    request(app)
      .post('/upload')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).to.equal('Upload successful');
      })
      .end(done);
  });
});
