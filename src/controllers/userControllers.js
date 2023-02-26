const { PrismaClient } = require("@prisma/client");
const model = new PrismaClient();
const { passwordRegExp, EmailRegExp } = require("../config/regExp");
const { errorCode, failCode, successCode } = require("../config/response");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/jwtoken");
const { getUserIDFromToken, avatarPath } = require("../config/function");
const fs = require("fs");

const signUp = async (req, res) => {
  try {
    const { email, password, age, user_name } = req.body;
    //check độ dài email
    if (email.length < 10 || email.length > 100) {
      failCode(res, "Email phải từ 10 - 100 ký tự!");
      return;
    }
    //check Regexp email
    if (!email.match(EmailRegExp)) {
      failCode(res, "Email không đúng định dạng!");
      return;
    }
    //check độ dài password
    if (password.length < 6 || password.length > 50) {
      failCode(res, "Password phải từ 6 - 50 ký tự!");
      return;
    }
    //check regexp password
    if (!password.match(passwordRegExp)) {
      failCode(
        res,
        "Password phải chứa ít nhất 1 ký tự, 1 ký tự in hoa, 1 ký tự đặc biệt, 1 số!"
      );
      return;
    }

    //check email đã tồn tại
    const checkEmail = await model.users.findFirst({
      where: {
        email,
      },
    });
    if (checkEmail) {
      failCode(res, "Email đã tồn tại!");
      return;
    }

    const data = {
      email,
      password: bcrypt.hashSync(password, 10),
      age,
      user_name,
      avatar: `avatardefault.png`,
    };

    await model.users.create({ data });
    successCode(res, "Tạo tài khoản thành công!", data);
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend");
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkEmailExist = await model.users.findFirst({
      where: {
        email,
      },
    });
    if (checkEmailExist) {
      if (bcrypt.compareSync(password, checkEmailExist.password)) {
        delete checkEmailExist["password"];
        successCode(res, "Đăng nhập thành công", {
          ...checkEmailExist,
          token: createToken({ email, user_id: checkEmailExist.user_id }),
        });
      } else failCode(res, "Email hoặc password không đúng!");
    } else {
      failCode(res, "Email hoặc password không đúng!");
    }
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend");
  }
};

const getUserInfo = async (req, res) => {
  try {
    const { user_id } = req.params;
    const checkIfExist = await model.users.findFirst({
      where: {
        user_id,
      },
    });
    if (checkIfExist) {
      delete checkIfExist["password"];
      successCode(res, "Lấy thông tin thành công", {
        ...checkIfExist,
        avatar: avatarPath + checkIfExist.avatar,
        status: checkIfExist.permission === 0 ? "Banned" : "Unbanned",
      });
    } else failCode(res, "Không tìm thấy user này!");
  } catch (error) {
    console.log(error);
  }
};

const getCurrentUserInfo = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const user_id = getUserIDFromToken(authorization);
    if (user_id) {
      const data = await model.users.findFirst({
        where: {
          user_id,
        },
      });
      if (data)
        successCode(res, "Lấy thông tin thành công!", {
          ...data,
          avatar: avatarPath + data.avatar,
        });
      else failCode(res, "Lỗi data");
    } else failCode(res, "Không tìm thấy user");
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const data = await model.users.findMany();
    successCode(res, "Thành công!", data);
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const checkIfExistUser = await model.users.findFirst({
      where: {
        user_id,
      },
    });

    await model.users.delete({
      where: {
        user_id,
      },
    });
    successCode(res, `Xóa thành công user ${checkIfExistUser.user_name}`);
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};

const setPermission = async (req, res) => {
  try {
    const { user_id, permission_value } = req.body;
    const checkIfExistUser = await model.users.findFirst({
      where: { user_id },
    });
    if (!checkIfExistUser) return failCode(res, "Không tìm thấy user này!");
    await model.users.update({
      where: {
        user_id,
      },
      data: {
        permission: permission_value,
      },
    });
    const permissionName = await model.permission.findFirst({
      where: {
        permission_value,
      },
    });
    return successCode(
      res,
      `Phân quyền cho ${checkIfExistUser.user_name} trở thành ${permissionName.permission_name} thành công!`
    );
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};

const banUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    await model.users.update({
      where: {
        user_id,
      },
      data: {
        permission: 0,
      },
    });
    successCode(res, "Ban user thành công!");
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};

const unbannedUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    await model.users.update({
      where: {
        user_id,
      },
      data: {
        permission: 1,
      },
    });
    successCode(res, "Unbanned user thành công!");
  } catch (error) {
    errorCode(res, "Lỗi backend!");
  }
};

const deleteAvatar = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const currentUserId = getUserIDFromToken(authorization);
    const userInfo = await model.users.findFirst({
      where: {
        user_id: currentUserId,
      },
    });
    if (userInfo) {
      if (userInfo.avatar === "avatardefault.png")
        return failCode(res, "Không có avatar để xóa!");
      fs.unlinkSync(avatarPath + "/" + userInfo.avatar);
      await model.users.update({
        where: {
          user_id: currentUserId,
        },
        data: {
          avatar: "avatardefault.png",
        },
      });
      return successCode(res, "Xóa avatar thành công!");
    }
  } catch (error) {
    console.log(error);
    errorCode(res, "Lỗi backend!");
  }
};

module.exports = {
  signUp,
  signIn,
  getUserInfo,
  getCurrentUserInfo,
  getAllUsers,
  deleteUser,
  setPermission,
  banUser,
  unbannedUser,
  deleteAvatar,
};
