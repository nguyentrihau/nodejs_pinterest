const { PrismaClient } = require("@prisma/client");
const model = new PrismaClient();
const path = require("path");
const { failCode, errorCode, successCode } = require("./response");
const avatarPath = `${process.cwd()}/public/img/avatar`;
const uploadPath = `${process.cwd()}/public/img/upload`;

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const getUserIDFromToken = (token) => {
  let user_id = parseJwt(token.split("Bearer ")[1]);
  return user_id.user_id;
};

const sizeCheck = (req, maxSize) => {
  const fileSize = parseInt(req.headers["content-length"]);
  if (fileSize < maxSize) {
    return true;
  }
  return false;
};

const avatarImgCheck = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (!sizeCheck(req, 3000000)) {
    req.fileValidationError = "Tối đa 3Mb!";
    return cb(null, false, req.fileValidationError);
  }

  if (!extname) {
    req.fileValidationError = "Chỉ được upload hình!";
    return cb(null, false, req.fileValidationError);
  }
  cb(null, true);
};

const imgCheck = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (!sizeCheck(req, 10000000)) {
    req.fileValidationError = "Tối đa 10Mb!";
    return cb(null, false, req.fileValidationError);
  }

  if (!extname) {
    req.fileValidationError = "Chỉ được upload hình!";
    return cb(null, false, req.fileValidationError);
  }
  cb(null, true);
};

const permissionCheckOnParams = async (req, res, next) => {
  const handleUserId = req.params.user_id;
  const { authorization } = req.headers;
  const currentUserId = getUserIDFromToken(authorization);
  const currentUserPermission = await model.users.findFirst({
    where: {
      user_id: currentUserId,
    },
  });
  const handleUserPermission = await model.users.findFirst({
    where: {
      user_id: handleUserId,
    },
  });

  if (currentUserPermission.permission <= handleUserPermission.permission) {
    failCode(res, "Không đủ quyền!");
    return;
  }
  if (!handleUserPermission) {
    failCode(res, "User không tồn tại!");
    return;
  }
  next();
};

const banPermissionCheckOnParams = async (req, res, next) => {
  const handleUserId = req.params.user_id;
  const { authorization } = req.headers;
  const currentUserId = getUserIDFromToken(authorization);
  const currentUserPermission = await model.users.findFirst({
    where: {
      user_id: currentUserId,
    },
  });
  const handleUserPermission = await model.users.findFirst({
    where: {
      user_id: handleUserId,
    },
  });
  if (currentUserPermission.permission < 3) {
    //moderators ->
    failCode(res, "Không đủ quyền!");
    return;
  }
  if (!handleUserPermission) {
    failCode(res, "User không tồn tại!");
    return;
  }
  next();
};

const permissionCheckInBody = async (req, res, next) => {
  const handleUserId = req.body.user_id;
  const { authorization } = req.headers;
  const currentUserId = getUserIDFromToken(authorization);
  const currentUserPermission = await model.users.findFirst({
    where: {
      user_id: currentUserId,
    },
  });
  const handleUserPermission = await model.users.findFirst({
    where: {
      user_id: handleUserId,
    },
  });

  if (currentUserPermission.permission <= handleUserPermission.permission) {
    failCode(res, "Không đủ quyền!");
    return;
  }
  if (!handleUserPermission) {
    failCode(res, "User không tồn tại!");
    return;
  }
  next();
};

const bannedCheck = async (req, res, next) => {
  const { authorization } = req.headers;
  const currentUserId = getUserIDFromToken(authorization);
  const userInfo = await model.users.findFirst({
    where: {
      user_id: currentUserId,
    },
  });

  if (userInfo.permission === 0)
    return failCode(res, "Banned user không thể post ảnh!");
};

const deleteImgAuthorCheck = async (req, res) => {
  try {
    const { img_id } = req.params;
    const { authorization } = req.headers;
    const currentUserId = getUserIDFromToken(authorization); // id người đang đi xóa
    const currentUser = await model.users.findFirst({
      where: {
        user_id: currentUserId,
      },
    });
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
    if (!imgAuthor) return failCode(res, "Không tìm thấy ảnh này!");
    let message = "";
    if (currentUser.permission >= 2) next();
    if (currentUserId !== imgAuthor.users.user_id)
      message = "Chỉ có author mới được quyền xóa ảnh!";
    if (message) return failCode(res, message);
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};

const deleteCommentAuthorCheck = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { authorization } = req.headers;
    const currentUserId = getUserIDFromToken(authorization);
    const currentUser = await model.users.findFirst({
      where: {
        user_id: currentUserId,
      },
    });
    const authorCheck = await model.comments.findFirst({
      where: {
        comment_id,
      },
    });
    if (!authorCheck) return failCode(res, "Không tìm thấy comment này!");
    let message = "";
    if (currentUser.permission >= 2) next();
    if (currentUserId !== authorCheck.user_id)
      message = "Không được xóa comment của người khác!";
    if (message) return failCode(res, message);
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};

module.exports = {
  parseJwt,
  getUserIDFromToken,
  sizeCheck,
  avatarImgCheck,
  avatarPath,
  permissionCheckOnParams,
  permissionCheckInBody,
  banPermissionCheckOnParams,
  uploadPath,
  imgCheck,
  bannedCheck,
  deleteImgAuthorCheck,
  deleteCommentAuthorCheck,
};
