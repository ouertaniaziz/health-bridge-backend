const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1 MB
  fileFilter: function (req, file, cb) {
    // Only allow certain file types
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
      
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});