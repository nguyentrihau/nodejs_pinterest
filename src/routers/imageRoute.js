const {
  getImgSchema,
  deleteImgSchema,
  getImgByUserIDSchema,
  getImgByNameSchema,
} = require("../config/schema");
const auth = require("@fastify/auth");
const {
  getImg,
  deleteImg,
  getAllImg,
  getImgByUserID,
  getImgByName,
  imgUpdate,
} = require("../controllers/imageControllers");
const { verifyToken } = require("../utils/jwtoken");
const {
  deleteImgAuthorCheck,
  getImgAuthorization,
  imgUpdateAuthorization,
} = require("../config/authorization/imageAuthorization");
const { bannedCheck } = require("../config/authorization/adminAuthorization");
const { imgUploadMulter } = require("../config/multer/imgUploadMulter");

const imageRoute = async (server) => {
  server
    .decorate("verifyToken", verifyToken)
    .decorate("deleteImgAuthorCheck", deleteImgAuthorCheck)
    .decorate("getImgAuthorization", getImgAuthorization)
    .decorate("bannedCheck", bannedCheck)
    .decorate("imgUpdateAuthorization", imgUpdateAuthorization)
    .register(auth);
  server.after(() => {
    server.get(
      "/:img_id",
      {
        ...getImgSchema,
        preHandler: server.auth([server.getImgAuthorization]),
      },
      getImg
    );
    server.delete(
      "/delete/:img_id",
      {
        ...deleteImgSchema,
        preHandler: [
          server.auth([server.verifyToken, server.deleteImgAuthorCheck], {
            relation: "and",
          }),
        ],
      },
      deleteImg
    );
    server.get(
      "/getImgByUserID/:user_id",
      { ...getImgByUserIDSchema },
      getImgByUserID
    );
    server.get("/getImgByName", { ...getImgByNameSchema }, getImgByName);
    server.get("/", {}, getAllImg);
    server.put(
      "/update/:img_id",
      {
        preHandler: [
          server.auth(
            [
              server.verifyToken,
              server.imgUpdateAuthorization,
              server.bannedCheck,
            ],
            {
              relation: "and",
            }
          ),
          imgUploadMulter.single("imgUpdate"),
        ],
      },
      imgUpdate
    );
  });
};

module.exports = imageRoute;
