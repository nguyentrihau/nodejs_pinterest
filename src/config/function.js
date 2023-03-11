const path = require("path");
const avatarPath = `${process.cwd()}/public/img/avatar`;
const uploadPath = `${process.cwd()}/public/img/upload`;
const preUploadPath = `${process.cwd()}/public/img/preUpload`;
const jwt = require("jsonwebtoken");

const { failCode } = require("./response");
const sharp = require("sharp");
const fs = require("fs");

const maxSize = 6000000; //6Mb

const getUserIDFromToken = (token) => {
  let user_id = jwt.decode(token.split("Bearer ")[1]);
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

  if (!sizeCheck(req, maxSize)) {
    req.fileValidationError = `Tối đa ${maxSize / 1000000}Mb!`;
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

  if (!sizeCheck(req, maxSize)) {
    req.fileValidationError = `Tối đa ${maxSize / 1000000}Mb!`;
    return cb(null, false, req.fileValidationError);
  }

  if (!extname) {
    req.fileValidationError = "Chỉ được upload hình!";
    return cb(null, false, req.fileValidationError);
  }
  cb(null, true);
};

const imgResponseObjectHandle = (object) => {
  object = {
    ...object,
    author: object.users,
  };
  object = {
    ...object,
    path: uploadPath + "/" + object.path,
  };
  object.author = {
    ...object.author,
    avatar: avatarPath + "/" + object.users.avatar,
  };
  delete object["users"];
  delete object["user_id"];
  delete object.author["permission"];
  delete object.author["password"];
  return object;
};

const cmtResponseHandle = (object) => {
  object = {
    ...object,
    author: object.users,
  };
  object.author = {
    ...object.author,
    avatar: avatarPath + "/" + object.author.avatar,
  };
  delete object.author["password"];
  delete object.author["permission"];
  delete object["user_id"];
  delete object["img_id"];
  delete object["users"];
  return object;
};

const userResponseHandle = (object) => {
  object.avatar = avatarPath + "/" + object.avatar;
  delete object["permission"];
  delete object["password"];
  return object;
};

const imgCompressHandler = async (req, res) => {
  const img = req.file;
  if (!img) return failCode(res, "Chưa có hình!");
  try {
    await sharp(`${preUploadPath}/${img.filename}`)
      .png({ quality: 80 })
      .jpeg({ quality: 80 })
      .toFile(`${uploadPath}/${img.filename}`);
    await fs.unlinkSync(`${preUploadPath}/${img.filename}`);
  } catch (error) {
    console.log(error);
  }
};

const avatarCompressHandler = async (req, res) => {
  const img = req.file;
  if (!img) return failCode(res, "Chưa có hình!");
  try {
    await sharp(`${preUploadPath}/${img.filename}`)
      .png({ quality: 80 })
      .jpeg({ quality: 80 })
      .toFile(`${avatarPath}/${img.filename}`);
    fs.unlinkSync(`${preUploadPath}/${img.filename}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUserIDFromToken,
  sizeCheck,
  avatarImgCheck,
  avatarPath,
  uploadPath,
  imgCheck,
  imgResponseObjectHandle,
  cmtResponseHandle,
  userResponseHandle,
  imgCompressHandler,
  preUploadPath,
  avatarCompressHandler,
};
