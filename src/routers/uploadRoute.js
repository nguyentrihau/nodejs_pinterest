const { avatarUpload, imgUpload } = require("../controllers/uploadControllers");
const { verifyToken } = require("../utils/jwtoken");
const multer = require("fastify-multer");
const {
  avatarImgCheck,
  avatarPath,
  uploadPath,
  imgCheck,
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
  server.addHook("onRequest", verifyToken).put(
    "/avatar",
    {
      preHandler: [avatarUploadMulter.single("avatar")],
    },
    avatarUpload
  );
  server
    .addHook("onRequest", verifyToken)
    .post(
      "/img",
      { preHandler: [imgUploadMulter.single("imgUpload")] },
      imgUpload
    );
};

module.exports = uploadRoute;
