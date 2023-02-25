const { PrismaClient } = require("@prisma/client");
const { getUserIDFromToken } = require("../config/function");
const { errorCode, failCode, successCode } = require("../config/response");
const model = new PrismaClient();

const postComment = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const currentUserId = getUserIDFromToken(authorization);
    const { comment_value, img_id } = req.body;
    const imgInfo = await model.images.findFirst({
      where: {
        img_id,
      },
    });
    if (!imgInfo) return failCode(res, "Không tìm ra ảnh này!");
    const data = {
      user_id: currentUserId,
      img_id,
      comment: comment_value,
      comment_time: new Date(),
    };
    await model.comments.create({
      data,
    });
    successCode(res, "Comment thành công!", data);
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};

const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    await model.comments.delete({
      where: {
        comment_id,
      },
    });
    return successCode(res, "Xóa comment thành công!");
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};

module.exports = {
  postComment,
  deleteComment,
};
