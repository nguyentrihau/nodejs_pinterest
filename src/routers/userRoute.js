const {
  permissionCheckOnParams,
  permissionCheckInBody,
  banPermissionCheckOnParams,
} = require("../config/function");
const {
  signUpSchema,
  signInSchema,
  getUserInfoSchema,
  deleteUserSchema,
  setPermissionSchema,
  banUserSchema,
} = require("../config/schema");
const {
  signUp,
  signIn,
  getUserInfo,
  getCurrentUserInfo,
  getAllUsers,
  deleteUser,
  setPermission,
  banUser,
  unbannedUser,
} = require("../controllers/userControllers");
const { verifyToken } = require("../utils/jwtoken");

const userRoute = async (server) => {
  server.post("/signUp", { ...signUpSchema }, signUp);
  server.post("/signIn", { ...signInSchema }, signIn);
  server.get("/getUserInfo/:user_id", { ...getUserInfoSchema }, getUserInfo);
  server.get(
    "/getCurrentUserInfo",
    { preHandler: [verifyToken] },
    getCurrentUserInfo
  );
  server.get("/getAllUsers", {}, getAllUsers);
  server.delete(
    "/deleteUser/:user_id",
    { ...deleteUserSchema, preHandler: [verifyToken, permissionCheckOnParams] },
    deleteUser
  );
  server.put(
    "/setPermission",
    {
      ...setPermissionSchema,
      preHandler: [verifyToken, permissionCheckInBody],
    },
    setPermission
  );
  server.put(
    "/banUser/:user_id",
    {
      ...banUserSchema,
      preHandler: [verifyToken, banPermissionCheckOnParams],
    },
    banUser
  );
  server.put(
    "/unbannedUser/:user_id",
    {
      ...banUserSchema,
      preHandler: [verifyToken, banPermissionCheckOnParams],
    },
    unbannedUser
  );
};

module.exports = userRoute;
