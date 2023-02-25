const { deleteCommentAuthorCheck } = require("../config/function");
const { postCommentSchema, deleteCommentSchema } = require("../config/schema");
const {
  postComment,
  deleteComment,
} = require("../controllers/commentControllers");
const { verifyToken } = require("../utils/jwtoken");

const commentRoute = async (server) => {
  server.post(
    "/post",
    {
      ...postCommentSchema,
      preHandler: [verifyToken],
    },
    postComment
  );
  server.delete(
    "/delete/:comment_id",
    {
      ...deleteCommentSchema,
      preHandler: [verifyToken, deleteCommentAuthorCheck],
    },
    deleteComment
  );
};

module.exports = commentRoute;
