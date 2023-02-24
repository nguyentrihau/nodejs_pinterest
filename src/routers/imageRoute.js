const { getImgSchema } = require("../config/schema");
const { getImg } = require("../controllers/imageControllers");

const imageRoute = async (server) => {
  server.get("/:img_id", { ...getImgSchema }, getImg);
};

module.exports = imageRoute;
