const auth = require("@fastify/auth");
const { bannedCheck } = require("../config/authorization/adminAuthorization");
const {
  deleteCommentAuthorCheck,
  editCommentAuthorCheck,
} = require("../config/authorization/commentAuthorization");
const {
  adminPermissionCheck,
} = require("../config/authorization/permissionCheck");
const {
  postCommentSchema,
  deleteCommentSchema,
  editCommentSchema,
  getCommentHistoryByIDSchema,
} = require("../config/schema");
const {
  postComment,
  deleteComment,
  editComment,
  getCommentHistoryByID,
  getCommentHistory,
} = require("../controllers/commentControllers");
const { verifyToken } = require("../utils/jwtoken");

const commentRoute = async (server) => {
  server
    .decorate("verifyToken", verifyToken)
    .decorate("deleteCommentAuthorCheck", deleteCommentAuthorCheck)
    .decorate("editCommentAuthorCheck", editCommentAuthorCheck)
    .decorate("bannedCheck", bannedCheck)
    .decorate("adminPermissionCheck", adminPermissionCheck)
    .register(auth);
  server.after(() => {
    server.post(
      "/post",
      {
        ...postCommentSchema,
        preHandler: server.auth([server.verifyToken, server.bannedCheck], {
          relation: "and",
        }),
      },
      postComment
    );

    server.put(
      "/edit",
      {
        ...editCommentSchema,
        preHandler: server.auth(
          [server.verifyToken, server.editCommentAuthorCheck],
          { relation: "and" }
        ),
      },
      editComment
    );

    server.delete(
      "/delete/:comment_id",
      {
        ...deleteCommentSchema,
        preHandler: server.auth(
          [
            server.verifyToken,
            server.deleteCommentAuthorCheck,
            server.bannedCheck,
          ],
          {
            relation: "and",
          }
        ),
      },
      deleteComment
    );
    server.get(
      "/history/:user_id",
      {
        ...getCommentHistoryByIDSchema,
        preHandler: server.auth(
          [server.verifyToken, server.adminPermissionCheck],
          {
            relation: "and",
          }
        ),
      },
      getCommentHistoryByID
    );
    server.get(
      "/history",
      {
        preHandler: server.auth([server.verifyToken]),
      },
      getCommentHistory
    );
  });
};

module.exports = commentRoute;
