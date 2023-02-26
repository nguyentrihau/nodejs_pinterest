const { getImgSchema, deleteImgSchema } = require("../config/schema");
const auth = require("@fastify/auth");
const {
  getImg,
  deleteImg,
  getAllImg,
} = require("../controllers/imageControllers");
const { verifyToken } = require("../utils/jwtoken");
const {
  deleteImgAuthorCheck,
} = require("../config/authorization/imageAuthorization");

const imageRoute = async (server) => {
  server
    .decorate("verifyToken", verifyToken)
    .decorate("deleteImgAuthorCheck", deleteImgAuthorCheck)
    .register(auth);
  server.after(() => {
    server.get("/:img_id", { ...getImgSchema }, getImg);
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
};

module.exports = imageRoute;
