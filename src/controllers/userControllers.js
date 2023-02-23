const { PrismaClient } = require("@prisma/client");
const { passwordRegExp, EmailRegExp } = require("../config/regExp");
const { errorCode, failCode, successCode } = require("../config/response");
const model = new PrismaClient();
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/jwtoken");

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
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
          email,
          token: createToken(checkEmailExist),
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

module.exports = {
  signUp,
  signIn,
};
