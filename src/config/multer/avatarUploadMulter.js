const multer = require("fastify-multer");
const { avatarPath, avatarImgCheck } = require("../function");

const avatarUploadMulter = multer({
  storage: multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, avatarPath);
    },
    filename: (req, file, cb) => {
      const d = new Date();
      const newName = d.getTime() + "_" + file.originalname;
      cb(null, newName.toLowerCase());
    },
  }),
  fileFilter: (req, file, cb) => {
    avatarImgCheck(req, file, cb);
  },
});

module.exports = {
  avatarUploadMulter,
};
