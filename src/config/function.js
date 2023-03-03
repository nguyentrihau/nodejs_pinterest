const path = require("path");
const avatarPath = `${process.cwd()}/public/img/avatar`;
const uploadPath = `${process.cwd()}/public/img/upload`;
var Jimp = require("jimp");
const { failCode } = require("./response");

const maxSize = 3000000; //3Mb

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

const imgCompressHandler = (req, res, next) => {
  const img = req.file;
  if (!img) next();
  try {
    Jimp.read(`${uploadPath}/${img.filename}`)
      .then((image) => {
        image.quality(60).write(`${uploadPath}/${img.filename}`);
      })
      .then(() => next())
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  parseJwt,
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
};
