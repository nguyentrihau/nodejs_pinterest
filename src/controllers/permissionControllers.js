const { successCode, errorCode } = require("../config/response");
const { PrismaClient } = require("@prisma/client");
const model = new PrismaClient();
const getAllPermission = async (req, res) => {
  try {
    const data = await model.permission.findMany();
    successCode(res, "lấy dữ liệu thành công", data);
  } catch (error) {
    errorCode(res, "Lỗi backend");
  }
};

module.exports = {
  getAllPermission,
};
