const { PrismaClient } = require("@prisma/client");
const {
  getUserIDFromToken,
  userResponseHandle,
  imgResponseObjectHandle,
} = require("../config/function");
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
    let newSave = await model.save.findFirst({
      where: {
        user_id: currentUserId,
        img_id,
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
    newSave.images = imgResponseObjectHandle(newSave.images);
    delete newSave["img_id"];
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
const getSavedHistory = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const currentUserId = getUserIDFromToken(authorization);
    let data = await model.save.findMany({
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
    for (let key in data) {
      data[key].images = imgResponseObjectHandle(data[key].images);
    }
    successCode(res, "lấy dữ liệu thành công", data);
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi Backend");
  }
};
const getSaveHistoryByID = async (req, res) => {
  try {
    const { user_id } = req.params;
    const checkIfExist = await model.users.findFirst({
      where: {
        user_id: Number(user_id),
      },
    });
    if (!checkIfExist) return failCode(res, "không tìm thấy user này");
    let data = await model.save.findMany({
      where: {
        user_id: Number(user_id),
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

    for (let index in data) {
      data[index].images = imgResponseObjectHandle(data[index].images);
    }
    successCode(res, "tìm hình đã save thành công", data);
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi Backend");
  }
};

module.exports = {
  saveImg,
  unSaveImg,
  getSavedHistory,
  getSaveHistoryByID,
};
