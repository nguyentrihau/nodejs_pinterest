const {
  checkPermissionByToken,
  bannedCheck,
} = require("../config/authorization/adminAuthorization");
const {
  signUpSchema,
  signInSchema,
  getUserInfoSchema,
  deleteUserSchema,
  setPermissionSchema,
  banUserSchema,
  saveImgSchema,
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
  deleteAvatar,
} = require("../controllers/userControllers");
const { verifyToken } = require("../utils/jwtoken");
const auth = require("@fastify/auth");
const { unSaveImg, saveImg } = require("../controllers/saveControllers");

const userRoute = async (server) => {
  server
    .decorate("verifyToken", verifyToken)
    .decorate("checkPermissionByToken", checkPermissionByToken)
    .decorate("bannedCheck", bannedCheck)
    .register(auth);

  server.after(() => {
    server.get("/getAllUsers", {}, getAllUsers);
    server.post("/signUp", { ...signUpSchema }, signUp);
    server.post("/signIn", { ...signInSchema }, signIn);
    server.get("/getUserInfo/:user_id", { ...getUserInfoSchema }, getUserInfo);
    server.get(
      "/getCurrentUserInfo",
      { preHandler: server.auth([server.verifyToken]) },
      getCurrentUserInfo
    );
    server.put(
      "/banUser/:user_id",
      {
        ...banUserSchema,
        preHandler: server.auth(
          [server.verifyToken, server.checkPermissionByToken],
          {
            relation: "and",
          }
        ),
      },
      banUser
    );
    server.put(
      "/unbannedUser/:user_id",
      {
        ...banUserSchema,
        preHandler: server.auth(
          [server.verifyToken, server.checkPermissionByToken],
          {
            relation: "and",
          }
        ),
      },
      unbannedUser
    );
    server.put(
      "/deleteAvatar",
      {
        preHandler: server.auth([server.verifyToken]),
      },
      deleteAvatar
    );
    server.put(
      "/setPermission",
      {
        ...setPermissionSchema,
        preHandler: server.auth(
          [server.verifyToken, server.checkPermissionByToken],
          {
            relation: "and",
          }
        ),
      },
      setPermission
    );

    server.get(
      "/save/:img_id",
      {
        ...saveImgSchema,
        preHandler: server.auth([server.verifyToken, server.bannedCheck], {
          relation: "and",
        }),
      },
      saveImg
    );
    server.delete(
      "/unsave/:img_id",
      {
        ...saveImgSchema,
        preHandler: server.auth([server.verifyToken, server.bannedCheck], {
          relation: "and",
        }),
      },
      unSaveImg
    );
  });

  // server.delete(
  //   "/deleteUser/:user_id",
  //   { ...deleteUserSchema, preHandler: [verifyToken, permissionCheckOnParams] },
  //   deleteUser
  // );
};

module.exports = userRoute;
