const { PrismaClient } = require("@prisma/client");
const { uploadPath, getUserIDFromToken } = require("../config/function");
const { errorCode, successCode, failCode } = require("../config/response");
const model = new PrismaClient();

const getImg = async (req, res) => {
  try {
    const { img_id } = req.params;
    let checkIfExistImg = await model.images.findFirst({
      where: {
        img_id,
      },
      select: {
        users: {
          select: {
            user_id: true,
            user_name: true,
            avatar: true,
            email: true,
            permission_users: {
              select: {
                permission_name: true,
              },
            },
          },
        },
        comments: {
          select: {
            comment: true,
            comment_time: true,
            users: {
              select: {
                user_id: true,
                user_name: true,
                email: true,
                permission_users: {
                  select: {
                    permission_name: true,
                  },
                },
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (checkIfExistImg) {
      return successCode(res, "Thành công!", {
        ...checkIfExistImg,
        path: uploadPath + checkIfExistImg.path,
      });
    }

    return failCode(res, "Không tìm thấy hình ảnh này!");
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};

const deleteImg = async (req, res) => {
  try {
    const { img_id } = req.params;
    const { authorization } = req.headers;
    const currentUserId = getUserIDFromToken(authorization); // id người đang đi xóa
    const imgAuthor = await model.images.findFirst({
      where: {
        img_id: Number(img_id),
      },
      select: {
        users: {
          select: {
            user_id: true,
          },
        },
      },
    });
    if (currentUserId === imgAuthor.users.user_id)
      return successCode(res, "Đây là author");
    else return failCode(res, "Không phải là author!");
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};

module.exports = {
  getImg,
  deleteImg,
};
