const passwordRegExp =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

const EmailRegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

module.exports = {
  passwordRegExp,
  EmailRegExp,
};
