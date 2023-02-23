const { PrismaClient } = require("@prisma/client");
const { passwordRegExp, EmailRegExp } = require("../config/regExp");
const { errorCode, failCode, successCode } = require("../config/response");
const model = new PrismaClient();
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/jwtoken");
const { getUserIDFromToken } = require("../config/function");

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
      avatar: process.env.DEFAULT_AVATAR,
    };

    await model.users.create({ data });
    successCode(res, "Tạo tài khoản thành công!");
  } catch (error) {
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
        successCode(res, "Đăng nhập thành công", {
          user_id: checkEmailExist.user_id,
          email,
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
      successCode(res, "Lấy thông tin thành công", checkIfExist);
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
      if (data) successCode(res, "Lấy thông tin thành công!", data);
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

module.exports = {
  signUp,
  signIn,
  getUserInfo,
  getCurrentUserInfo,
  getAllUsers,
};
