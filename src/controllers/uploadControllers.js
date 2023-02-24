const { PrismaClient } = require("@prisma/client");
const { errorCode, successCode, failCode } = require("../config/response");
const model = new PrismaClient();
const fs = require("fs");

const { getUserIDFromToken } = require("../config/function");

const avatarUpload = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const user_id = getUserIDFromToken(authorization);
    const img = req.file;
    if (req.fileValidationError) return failCode(res, req.fileValidationError);

    const userFromToken = await model.users.findFirst({
      where: {
        user_id,
      },
    });

    if (userFromToken) {
      await model.users.update({
        where: {
          user_id,
        },
        data: {
          avatar: img.filename,
        },
      });
      return successCode(res, "Upload avatar thành công!");
    }
    return failCode(res, "Upload thất bại!");
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
};

const imgUpload = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { img_name } = req.body;
    const user_id = getUserIDFromToken(authorization);
    const img = req.file;
    if (req.fileValidationError) return failCode(res, req.fileValidationError);
    const checkIfExistUser = await model.users.findFirst({
      where: {
        user_id,
      },
    });
    if (!img) return failCode(res, "Chưa có hình!");
    if (checkIfExistUser) {
      if (!img_name) return failCode(res, "Điền tên hình ảnh!");
      const d = new Date();
      const data = {
        user_id,
        img_name,
        img_time: d,
        path: img.filename,
      };
      await model.images.create({ data });
      return successCode(res, "Upload thành công");
    }
    return failCode(res, "Upload không thành công!");
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi Backend");
  }
};

module.exports = {
  avatarUpload,
  imgUpload,
};
