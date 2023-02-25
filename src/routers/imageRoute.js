const { deleteImgAuthorCheck } = require("../config/function");
const { getImgSchema, deleteImgSchema } = require("../config/schema");
const {
  getImg,
  deleteImg,
  getAllImg,
} = require("../controllers/imageControllers");

const imageRoute = async (server) => {
  server.get("/:img_id", { ...getImgSchema }, getImg);
  server.delete(
    "/delete/:img_id",
    { ...deleteImgSchema, preHandler: [deleteImgAuthorCheck] },
    deleteImg
  );
  server.get("/", {}, getAllImg);
};

module.exports = imageRoute;
