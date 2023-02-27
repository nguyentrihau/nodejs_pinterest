const { PrismaClient } = require("@prisma/client");
const {
  uploadPath,
  getUserIDFromToken,
  avatarPath,
  imgResponseObjectHandle,
  cmtResponseHandle,
} = require("../config/function");
const { errorCode, successCode, failCode } = require("../config/response");
const fs = require("fs");
const model = new PrismaClient();

const getImg = async (req, res) => {
  try {
    const { img_id } = req.params;
    const { authorization } = req.headers;
    let currentUserId;
    if (authorization) currentUserId = getUserIDFromToken(authorization);
    let checkSaved;
    if (currentUserId) {
      checkSaved = await model.save.findFirst({
        where: {
          img_id,
          user_id: currentUserId,
        },
      });
    }
    let checkIfExistImg = await model.images.findFirst({
      where: {
        img_id,
      },
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
        comments: {
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

    if (checkIfExistImg) {
      for (let key in checkIfExistImg.comments) {
        checkIfExistImg.comments[key] = cmtResponseHandle(
          checkIfExistImg.comments[key]
        );
      }

      const newData = imgResponseObjectHandle(checkIfExistImg);
      return successCode(res, "Thành công!", {
        ...newData,
        path: uploadPath + checkIfExistImg.path,
        ...(currentUserId && { saved: checkSaved ? true : false }),
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
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};

const getAllImg = async (req, res) => {
  try {
    const data = await model.images.findMany({
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
    });
    for (let key in data) {
      data[key] = imgResponseObjectHandle(data[key]);
    }
    return successCode(res, "Thành công", data);
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};
const getImgByUserID = async (req, res) => {
  try {
    const { user_id } = req.params;
    const checkIfExistUser = await model.users.findFirst({
      where: {
        user_id,
      },
    });
    if (!checkIfExistUser) return failCode(res, "user này không tồn tại");
    const dataImgByID = await model.images.findMany({
      where: {
        user_id,
      },
    });
    for (let value of dataImgByID) {
      delete value["user_id"];
    }
    for (let index in dataImgByID) {
      dataImgByID[index] = {
        ...dataImgByID[index],
        path: uploadPath + "/" + dataImgByID[index].path,
      };
    }
    successCode(res, "thành công", dataImgByID);
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};
const getImgByName = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return failCode(res, "keyword không được để trống");
    const dataImgByName = await model.images.findMany({
      where: {
        img_name: {
          contains: keyword,
        },
      },
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
    });
    if (dataImgByName.length === 0)
      successCode(res, "không tìm thấy kết quả nào");
    for (let key in dataImgByName) {
      dataImgByName[key] = imgResponseObjectHandle(dataImgByName[key]);
    }
    successCode(res, "thành công", dataImgByName);
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};
module.exports = {
  getImg,
  deleteImg,
  getAllImg,
  getImgByUserID,
  getImgByName,
};
