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
    if (!user_id) {
      failCode(res, "Token không hợp lệ!");
      return;
    }
    const checkIfExist = await model.users.findFirst({
      where: {
        user_id,
      },
    });
    if (checkIfExist) {
      fs.readFile(
        process.cwd() + "/public/img/" + img.filename,
        (err, data) => {
          let fileName = `data:${img.mimetype};base64,${Buffer.from(
            data
          ).toString("base64")}`;
          //xoa hình vừa up
          fs.unlinkSync(process.cwd() + "/public/img/" + img.filename);
          const models = {
            ...checkIfExist,
            avatar: fileName,
          };
          model.users.update({
            data: models,
            where: {
              user_id: checkIfExist.user_id,
            },
          });
        }
      );
      successCode(res, `Upload successfully`);
    }
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
};

module.exports = {
  avatarUpload,
};
