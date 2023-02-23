const jwt = require("jsonwebtoken");
const { errorCode, failCode } = require("../config/response");

const createToken = (payload) => {
  const token = jwt.sign({ ...payload }, process.env.TOKEN_KEY, {
    expiresIn: "24h",
  });
  return token;
};

const checkToken = (token) => {
  const result = jwt.verify(token, process.env.TOKEN_KEY);
  return result;
};

const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (checkToken(token)) next();
    else failCode(res, "Token không hợp lệ!");
  } catch (error) {
    errorCode(res, "Lỗi backend");
  }
};

module.exports = {
  createToken,
  verifyToken,
};
