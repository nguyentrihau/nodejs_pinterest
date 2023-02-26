const { PrismaClient } = require("@prisma/client");
const { getUserIDFromToken } = require("../function");
const { failCode, errorCode } = require("../response");
const { adminAuth } = require("./adminAuthorization");
const model = new PrismaClient();

const deleteCommentAuthorCheck = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { authorization } = req.headers;
    const currentUserId = getUserIDFromToken(authorization);
    const authorCheck = await model.comments.findFirst({
      where: {
        comment_id,
      },
    });
    let message;
    if (!authorCheck) message = "Không tìm thấy comment này!";
    else if (!adminAuth(req)) {
      //not admin
      if (currentUserId !== authorCheck.user_id)
        message = "Không được xóa comment của người khác!";
    }
    if (message) return failCode(res, message);
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};

const editCommentAuthorCheck = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const currentUserId = getUserIDFromToken(authorization);
    const { comment_id, comment_value } = req.body;
    const currentComment = await model.comments.findFirst({
      where: {
        comment_id,
      },
    });
    let message;
    if (!currentComment) message = "Không tìm ra comment này!";
    else if (!comment_value) message = "Không được để trống!";
    else if (!(await adminAuth(req))) {
      if (currentUserId !== currentComment.user_id)
        message = "Không được sửa comment của người khác!";
    }
    if (message) return failCode(res, message);
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};

module.exports = {
  deleteCommentAuthorCheck,
  editCommentAuthorCheck,
};
