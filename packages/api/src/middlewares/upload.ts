import multer from "multer";
import os from "os";
import ValidationError from "../lib/errors/validation-error";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {},
  fileFilter: (req, file, cb) => {
    file.mimetype;
  },
});

export function uploadMiddleware(
  fields: { name: string; maxCount: number }[],
  config: { allowedMimetype: string[] }
) {
  const upload = multer({
    storage: storage,
    limits: {},
    fileFilter: (req, file, cb) => {
      if (config.allowedMimetype.includes(file.mimetype)) {
        return cb(null, true);
      }

      return cb(new ValidationError("Invalid file type"));
    },
  });
  return upload.fields(fields);
}

export default upload;
