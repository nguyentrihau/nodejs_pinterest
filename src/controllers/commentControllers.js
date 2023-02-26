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
    if (!comment_value) return failCode(res, "Không được để trống!");
    const data = {
      user_id: currentUserId,
      img_id,
      comment: comment_value,
      comment_time: new Date(),
    };
    await model.comments.create({
      data,
    });
    const newComment = await model.comments.findFirst({
      where: {
        img_id,
        user_id: currentUserId,
      },
      select: {
        comment_id: true,
        comment: true,
        comment_time: true,
        images: {
          select: {
            img_id: true,
            img_name: true,
            img_time: true,
            path: true,
          },
        },
      },
      orderBy: {
        comment_time: "desc",
      },
      take: 1,
    });
    successCode(res, "Comment thành công!", newComment);
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};

const editComment = async (req, res) => {
  try {
    const { comment_value, comment_id } = req.body;
    const currentComment = await model.comments.findFirst({
      where: {
        comment_id,
      },
    });

    if (currentComment) {
      await model.comments.update({
        where: {
          comment_id,
        },
        data: {
          comment: comment_value,
        },
      });
      const newComment = await model.comments.findFirst({
        where: {
          comment_id,
        },
        select: {
          comment_id: true,
          comment: true,
          comment_time: true,
          images: {
            select: {
              img_id: true,
              img_name: true,
              img_time: true,
              path: true,
            },
          },
        },
      });
      successCode(res, "Sửa comment thành công", newComment);
    }
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};

const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const comment = await model.comments.delete({
      where: {
        comment_id,
      },
    });
    if (!comment) return failCode(res, "Không tìm ra comment này!");
    return successCode(res, "Xóa comment thành công!");
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};

module.exports = {
  postComment,
  deleteComment,
  editComment,
};
