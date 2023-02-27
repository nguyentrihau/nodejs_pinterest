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
} = require("../controllers/imageControllers");
const { verifyToken } = require("../utils/jwtoken");
const {
  deleteImgAuthorCheck,
  getImgAuthorization,
} = require("../config/authorization/imageAuthorization");

const imageRoute = async (server) => {
  server
    .decorate("verifyToken", verifyToken)
    .decorate("deleteImgAuthorCheck", deleteImgAuthorCheck)
    .decorate("getImgAuthorization", getImgAuthorization)
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
    server.get("/", {}, getAllImg);
  });
  server.get(
    "/getImgByUserID/:user_id",
    { ...getImgByUserIDSchema },
    getImgByUserID
  );
  server.get("/getImgByName", { ...getImgByNameSchema }, getImgByName);
};

module.exports = imageRoute;
