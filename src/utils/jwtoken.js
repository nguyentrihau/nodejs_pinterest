const jwt = require("jsonwebtoken");
const { failCode } = require("../config/response");

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

const verifyToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split("Bearer ")[1];
    if (!token) {
      failCode(res, "Token không hợp lệ!");
      return;
    }
    if (checkToken(token)) next();
  } catch (error) {
    failCode(res, "Token không hợp lệ!");
  }
};

module.exports = {
  createToken,
  verifyToken,
};
