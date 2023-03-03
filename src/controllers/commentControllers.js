const { PrismaClient } = require("@prisma/client");
const {
  getUserIDFromToken,
  imgResponseObjectHandle,
} = require("../config/function");
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
    let newComment = await model.comments.findFirst({
      where: {
        img_id,
        user_id: currentUserId,
      },
      include: {
        images: {
          include: {
            users: {
              include: {
                permission_users: {
                  select: {
                    permission_name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        comment_time: "desc",
      },
      take: 1,
    });
    newComment.images = imgResponseObjectHandle(newComment.images);
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
      let newComment = await model.comments.findFirst({
        where: {
          comment_id,
        },
        include: {
          images: {
            include: {
              users: {
                include: {
                  permission_users: {
                    select: {
                      permission_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      newComment.images = imgResponseObjectHandle(newComment.images);
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
const getCommentHistoryByID = async (req, res) => {
  try {
    const { user_id } = req.params;
    const checkIfExist = await model.users.findFirst({
      where: {
        user_id,
      },
    });
    if (!checkIfExist) return failCode(res, "không tìm thấy user này");
    let dataComment = await model.comments.findMany({
      where: {
        user_id,
      },
      select: {
        comment: true,
        comment_id: true,
        comment_time: true,
        images: {
          include: {
            users: true,
          },
        },
      },
    });

    for (let value of dataComment) {
      delete value.images.users["password"];
    }

    for (let i = 0; i < dataComment.length; i++) {
      dataComment[i] = {
        ...dataComment[i],
        images: {
          ...dataComment[i].images,
          author: dataComment[i].images.users,
        },
      };
      delete dataComment[i].images["users"];
    }

    successCode(res, "tìm comment thành công", dataComment);
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};

const getCommentHistory = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const currentUserId = getUserIDFromToken(authorization);
    const commentHistory = await model.comments.findMany({
      where: {
        user_id: currentUserId,
      },
      include: {
        images: {
          include: {
            users: {
              include: {
                permission_users: {
                  select: {
                    permission_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    for (let key in commentHistory) {
      commentHistory[key].images = imgResponseObjectHandle(
        commentHistory[key].images
      );
      delete commentHistory[key].user_id;
      delete commentHistory[key].img_id;
    }

    successCode(res, "Thành Công!", commentHistory);
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};
module.exports = {
  postComment,
  deleteComment,
  editComment,
  getCommentHistoryByID,
  getCommentHistory,
};
