const multer = require("multer");

const multerFiltering = (req, file, cb) => {
  // Memeriksa apakah file yang diupload adalah gambar PNG atau JPEG
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true); // Jika valid, lanjutkan
  } else {
    cb(new Error("Image format is not valid! Only PNG and JPEG are allowed."), false); // Jika tidak valid, berikan error
  }
};

const upload = multer({
  fileFilter: multerFiltering, // Menggunakan filter yang telah dibuat
});

// Ekspor middleware
module.exports = upload;
