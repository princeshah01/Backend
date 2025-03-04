const multer = require("multer");
const path = require("path");

const fileStorage = multer.diskStorage({
  //setting destination folder to store files

  destination: (req, file, callback) => {
    callback(null, "/uploads");
  },
  // fileName setup here
  filename: (req, file, callback) => {
    const filepath = Date.now() + path.extname(file.originalname);
    callback(null, filepath);
  },
});

const upload = multer({ storage: fileStorage });

module.exports = upload;
