const { getImgSchema } = require("../config/schema");
const { getImg, deleteImg } = require("../controllers/imageControllers");

const imageRoute = async (server) => {
  server.get("/:img_id", { ...getImgSchema }, getImg);
  server.delete("/delete/:img_id", {}, deleteImg);
};

module.exports = imageRoute;
