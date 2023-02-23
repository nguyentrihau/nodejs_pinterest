const { upload } = require("../config/function");
const { avatarUpload } = require("../controllers/uploadControllers");
const { verifyToken } = require("../utils/jwtoken");

const uploadRoute = async (server) => {
  server.addHook("onRequest", verifyToken).post(
    "/avatar",
    {
      preHandler: [upload.single("avatar")],
    },
    avatarUpload
  );
};

module.exports = uploadRoute;
