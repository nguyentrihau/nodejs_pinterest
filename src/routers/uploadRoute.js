const { avatarUpload, imgUpload } = require("../controllers/uploadControllers");
const { verifyToken } = require("../utils/jwtoken");
const auth = require("@fastify/auth");
const { bannedCheck } = require("../config/authorization/adminAuthorization");
const { avatarUploadMulter } = require("../config/multer/avatarUploadMulter");
const {
  imgUploadMulter,
  imgUploadMulterTest,
} = require("../config/multer/imgUploadMulter");

const { successCode } = require("../config/response");
const { imgCompressHandler } = require("../config/function");

const uploadRoute = async (server) => {
  server
    .decorate("verifyToken", verifyToken)
    .decorate("bannedCheck", bannedCheck)
    .register(auth);

  server.after(() => {
    server.put(
      "/avatar",
      {
        preHandler: [
          server.auth([server.verifyToken, server.bannedCheck], {
            relation: "and",
          }),
          avatarUploadMulter.single("avatar"),
        ],
      },
      avatarUpload
    );

    server.post(
      "/img",
      {
        preHandler: [
          server.auth([server.verifyToken, server.bannedCheck], {
            relation: "and",
          }),
          imgUploadMulter.single("imgUpload"),
          imgCompressHandler,
        ],
      },
      imgUpload
    );
  });
};

module.exports = uploadRoute;
