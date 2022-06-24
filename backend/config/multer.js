const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    dest: path.resolve('../collegespace/dicionario/client/public/', 'uploads'),
    storage: multer.diskStorage({
        destination: (req, file , cb) => {
            // era __dirname
            cb(null, path.resolve('../collegespace/dicionario/client/public/', 'sinais'));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(6, (err, hash) => {
                if (err) cb(err);
                const fileName = file.originalname;
                cb(null, fileName);
            })
        }
    }),
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
          'image/jpeg',
          'image/pjpeg',
          'image/png',
          'image/gif',
          'image/jpg',
          'video/mp4',
      ];

      console.log(file);

      if (allowedMimes.includes(file.mimetype)){
          cb(null, true);

      } else {
          cb(new Error('Invalid file type'));
      }
    },
}