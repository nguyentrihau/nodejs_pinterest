const { PrismaClient } = require("@prisma/client");
const { checkToken } = require("../../utils/jwtoken");
const { getUserIDFromToken } = require("../function");
const { failCode, errorCode } = require("../response");
const { adminAuth } = require("./adminAuthorization");
const model = new PrismaClient();
const deleteImgAuthorCheck = async (req, res) => {
  try {
    const { img_id } = req.params;
    const { authorization } = req.headers;
    const currentUserId = getUserIDFromToken(authorization); // id người đang đi xóa
    const imgAuthor = await model.images.findFirst({
      where: {
        img_id,
      },
      select: {
        users: {
          select: {
            user_id: true,
          },
        },
      },
    });
    let message;
    if (!imgAuthor) message = "Không tìm thấy ảnh này!";
    else if (!adminAuth(req)) {
      if (currentUserId !== imgAuthor.users.user_id)
        message = "Chỉ có author mới được quyền xóa ảnh!";
    }
    if (message) return failCode(res, message);
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};

const getImgAuthorization = async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.split("Bearer ")[1];
      if (!token) {
        failCode(res, "Token không hợp lệ!");
        return;
      }
      if (!checkToken(token)) return failCode(res, "Token không hợp lệ!");
    }
  } catch (error) {
    console.log(error);
    failCode(res, "Token không hợp lệ!");
  }
};

const imgUpdateAuthorization = async (req, res) => {
  const { authorization } = req.headers;
  const { img_id } = req.params;
  const currentUserId = getUserIDFromToken(authorization);
  try {
    const edittingImg = await model.images.findUnique({
      where: {
        img_id: Number(img_id),
      },
    });
    let message;
    if (!edittingImg) return (message = "Không tìm ra ảnh này!");
    if (!(await adminAuth(req))) {
      // nếu ko phải là admin -> check author
      if (edittingImg.user_id !== currentUserId)
        message = "Không được sửa ảnh của người khác!";
    }
    if (message) return failCode(res, message);
  } catch (error) {
    console.log(error);
    failCode(res, "Token không hợp lệ!");
  }
};

module.exports = {
  deleteImgAuthorCheck,
  getImgAuthorization,
  imgUpdateAuthorization,
};
