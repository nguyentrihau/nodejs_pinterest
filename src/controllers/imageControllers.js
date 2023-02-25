const { PrismaClient } = require("@prisma/client");
const { uploadPath } = require("../config/function");
const { errorCode, successCode, failCode } = require("../config/response");
const fs = require("fs");
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
            comment_id: true,
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
        save: {
          select: {
            users: {
              select: {
                user_id: true,
                user_name: true,
                email: true,
                avatar: true,
                permission_users: {
                  select: {
                    permission_name: true,
                  },
                },
              },
            },
            images: true,
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
    const findImg = await model.images.findFirst({
      where: {
        img_id,
      },
    });
    if (!findImg) return failCode(res, "Không tìm thấy hình ảnh này!");
    fs.unlinkSync(uploadPath + "/" + findImg.path);
    await model.comments.deleteMany({
      where: {
        img_id,
      },
    });
    await model.save.deleteMany({
      where: {
        img_id,
      },
    });
    await model.images.delete({
      where: {
        img_id,
      },
    });
    successCode(res, "Xóa thành công!");
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};

const getAllImg = async (req, res) => {
  try {
    const data = await model.images.findMany({
      include: {
        users: {
          select: {
            user_id: true,
            user_name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    return successCode(res, "Thành công", data);
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};

module.exports = {
  getImg,
  deleteImg,
  getAllImg,
};
