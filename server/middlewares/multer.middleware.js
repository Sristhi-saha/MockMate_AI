import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = "public";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const multerMiddleware = multer({ 
  storage: storage, 
  limits: { fileSize: 1024 * 1024 * 5 } // 5 MB
});

export default multerMiddleware;