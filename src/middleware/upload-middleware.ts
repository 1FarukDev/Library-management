import multer from 'multer';

const storage = multer.memoryStorage();

const uploadMiddleware = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/epub+zip',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, EPUB, JPEG, PNG, and JPG are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

export default uploadMiddleware;
