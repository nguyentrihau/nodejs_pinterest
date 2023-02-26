const commentRoute = require("./commentRoute");
const uploadRoute = require("./uploadRoute");
const userRoute = require("./userRoute");
const imageRoute = require("./imageRoute");

const rootRoute = async (server) => {
  server.register(userRoute, { prefix: "/user" });
  server.register(imageRoute, { prefix: "/image" });
  server.register(commentRoute, { prefix: "/comment" });
  server.register(uploadRoute, { prefix: "/upload" });
};

module.exports = rootRoute;
