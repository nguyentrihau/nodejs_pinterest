const { avatarUpload, imgUpload } = require("../controllers/uploadControllers");
const { verifyToken } = require("../utils/jwtoken");

const multer = require("fastify-multer");
const {
  avatarImgCheck,
  avatarPath,
  uploadPath,
  imgCheck,
  bannedCheck,
} = require("../config/function");

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

const uploadRoute = async (server) => {
  server.put(
    "/avatar",
    {
      preHandler: [
        verifyToken,
        bannedCheck,
        avatarUploadMulter.single("avatar"),
      ],
    },
    avatarUpload
  );
  server.post(
    "/img",
    {
      preHandler: [
        verifyToken,
        bannedCheck,
        imgUploadMulter.single("imgUpload"),
      ],
    },
    imgUpload
  );
};

module.exports = uploadRoute;
