const commentRoute = require("./commentRoute");
const uploadRoute = require("./uploadRoute");
const userRoute = require("./userRoute");
const imageRoute = require("./imageRoute");
const permissionRoute = require("./permissionRoute");

const rootRoute = async (server) => {
  server.register(userRoute, { prefix: "/user" });
  server.register(imageRoute, { prefix: "/image" });
  server.register(commentRoute, { prefix: "/comment" });
  server.register(uploadRoute, { prefix: "/upload" });
  server.register(permissionRoute, { prefix: "/permission" });
};

module.exports = rootRoute;
