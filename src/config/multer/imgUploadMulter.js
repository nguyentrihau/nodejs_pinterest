const { imgCheck, preUploadPath, uploadPath } = require("../function");
const multer = require("fastify-multer");

const imgUploadMulter = multer({
  storage: multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const d = new Date();
      const newName = d.getTime() + "_" + file.originalname;
      cb(null, newName.toLowerCase());
    },
  }),
  fileFilter: (req, file, cb) => {
    imgCheck(req, file, cb);
  },
});

module.exports = {
  imgUploadMulter,
};
