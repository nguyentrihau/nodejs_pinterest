const { PrismaClient } = require("@prisma/client");
const model = new PrismaClient();
const path = require("path");
const { failCode } = require("./response");
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

const banPermissionCheckonParams = async (req, res, next) => {
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

module.exports = {
  parseJwt,
  getUserIDFromToken,
  sizeCheck,
  avatarImgCheck,
  avatarPath,
  permissionCheckOnParams,
  permissionCheckInBody,
  banPermissionCheckonParams,
  uploadPath,
  imgCheck,
};
