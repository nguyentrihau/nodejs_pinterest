const { PrismaClient } = require("@prisma/client");
const { uploadPath } = require("../config/function");
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
            user_name: true,
            user_id: true,
            permission: true,
          },
        },
        comments: true,
      },
    });
    if (checkIfExistImg) {
      const permissionValue = await model.permission.findFirst({
        where: {
          permission_value: checkIfExistImg.users.permission,
        },
        select: {
          permission_name: true,
        },
      });
      checkIfExistImg.users = {
        ...checkIfExistImg.users,
        permission: permissionValue.permission_name,
      };
      delete checkIfExistImg["user_id"];
      return successCode(res, "Thành công!", {
        ...checkIfExistImg,
        path: uploadPath + checkIfExistImg.path,
      });
    }

    return failCode(res, "Không tìm thấy hình ảnh này!");
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};

module.exports = {
  getImg,
};
