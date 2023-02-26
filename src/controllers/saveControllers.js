const { PrismaClient } = require("@prisma/client");
const { getUserIDFromToken } = require("../config/function");
const { errorCode, failCode, successCode } = require("../config/response");
const model = new PrismaClient();

const saveImg = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const currentUserId = getUserIDFromToken(authorization);
    const { img_id } = req.params;
    const currentUser = await model.users.findFirst({
      where: {
        user_id: currentUserId,
      },
    });
    const currentImg = await model.images.findFirst({
      where: {
        img_id,
      },
    });
    if (!currentUser) return failCode(res, "user không tồn tại");
    if (!currentImg) return failCode(res, "hình này không tồn tại");
    const checkIfExist = await model.save.findFirst({
      where: {
        user_id: currentUserId,
        img_id,
      },
    });
    if (checkIfExist)
      return failCode(
        res,
        `User ${currentUser.user_name} đã save hình ${currentImg.img_name} rồi!`
      );
    await model.save.create({
      data: {
        user_id: currentUserId,
        img_id,
        save_time: new Date(),
      },
    });
    const newSave = await model.save.findFirst({
      where: {
        user_id: currentUserId,
        img_id,
      },
    });
    successCode(res, "lưu hình ảnh thành công", newSave);
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi Backend");
  }
};
const unSaveImg = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const currentUserId = getUserIDFromToken(authorization);
    const { img_id } = req.params;
    const checkIfExist = await model.save.findFirst({
      where: {
        user_id: currentUserId,
        img_id,
      },
      select: {
        images: {
          select: {
            img_name: true,
          },
        },
      },
    });
    if (!checkIfExist) return failCode(res, "Chưa save hình này!");

    await model.save.deleteMany({
      where: {
        id: checkIfExist.id,
      },
    });
    successCode(res, "Unsave thành công hình " + checkIfExist.images.img_name);
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi Backend");
  }
};
module.exports = {
  saveImg,
  unSaveImg,
};
