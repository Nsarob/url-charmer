import multer from "multer";
import path from "path";

const DESTINATION = "../../../cv_uploads/";

var multerStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, DESTINATION));
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

export const upload = multer({ storage: multerStorage });
