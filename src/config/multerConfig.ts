import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  uploadsFolder: path.resolve(__dirname, '..', 'shared', 'uploads'),

  tmpFolder,

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(_, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },
};
