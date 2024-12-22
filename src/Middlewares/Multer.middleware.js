import multer from "multer"

const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})


export const upload = multer({
  storage: Storage,
  // fileFilter, // Uncomment this to validate file types
})