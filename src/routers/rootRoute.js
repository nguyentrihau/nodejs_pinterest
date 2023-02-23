const commentRoute = require("./commentRoute");
const imageRoute = require("./imageRoute");
const saveRoute = require("./saveRoute");
const userRoute = require("./userRoute");

const rootRoute = async (server) => {
  server.register(userRoute, { prefix: "/user" });
  server.register(imageRoute, { prefix: "/image" });
  server.register(saveRoute, { prefix: "/save" });
  server.register(commentRoute, { prefix: "/comment" });
};

module.exports = rootRoute;
