const commentRoute = require("./commentRoute");
const imageRoute = require("./imageRoute");
const saveRoute = require("./saveRoute");
const uploadRoute = require("./uploadRoute");
const userRoute = require("./userRoute");
const verifyToken = require("../utils/jwtoken");

const rootRoute = async (server) => {
  server.register(userRoute, { prefix: "/user" });
  server.register(imageRoute, { prefix: "/image" });
  server.register(saveRoute, { prefix: "/save" });
  server.register(commentRoute, { prefix: "/comment" });
  server.register(uploadRoute, { prefix: "/upload" });
};

module.exports = rootRoute;
