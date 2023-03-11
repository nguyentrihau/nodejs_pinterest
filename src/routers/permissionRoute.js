const { getAllPermission } = require("../controllers/permissionControllers");

const permissionRoute = async (server) => {
  server.get("/getAllPermission", {}, getAllPermission);
};
module.exports = permissionRoute;
