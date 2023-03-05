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
  userUpdate,
} = require("../controllers/userControllers");
const { verifyToken } = require("../utils/jwtoken");
const auth = require("@fastify/auth");
const {
  unSaveImg,
  saveImg,
  getSaveHistoryByID,
  getSavedHistory,
} = require("../controllers/saveControllers");
const { avatarUploadMulter } = require("../config/multer/avatarUploadMulter");
const { avatarCompressHandler } = require("../config/function");
const {
  moderatorPermissionCheck,
  adminPermissionCheck,
} = require("../config/authorization/permissionCheck");

const userRoute = async (server) => {
  server
    .decorate("verifyToken", verifyToken)
    .decorate("adminPermissionCheck", adminPermissionCheck)
    .decorate("bannedCheck", bannedCheck)
    .decorate("moderatorPermissionCheck", moderatorPermissionCheck)
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
          [server.verifyToken, server.moderatorPermissionCheck],
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
          [server.verifyToken, server.moderatorPermissionCheck],
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
          [server.verifyToken, server.adminPermissionCheck],
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
    server.put(
      "/update",
      {
        preHandler: [
          server.auth([server.verifyToken, server.bannedCheck], {
            relation: "and",
          }),
          avatarUploadMulter.single("avatar"),
          avatarCompressHandler,
        ],
      },
      userUpdate
    );
    server.delete(
      "/deleteUser/:user_id",
      {
        ...deleteUserSchema,
        preHandler: server.auth(
          [server.verifyToken, server.adminPermissionCheck],
          { relation: "and" }
        ),
      },
      deleteUser
    );
    server.get(
      "/getSavedHistory",
      {
        preHandler: server.auth([server.verifyToken]),
      },
      getSavedHistory
    );
    server.get(
      "/getSavedHistoryByID/:user_id",
      {
        preHandler: server.auth(
          [server.verifyToken, server.adminPermissionCheck],
          { relation: "and" }
        ),
      },
      getSaveHistoryByID
    );
  });
};

module.exports = userRoute;
