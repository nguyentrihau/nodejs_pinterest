const { PrismaClient } = require("@prisma/client");
const { getUserIDFromToken } = require("../function");
const { failCode } = require("../response");
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

module.exports = {
  deleteImgAuthorCheck,
};
