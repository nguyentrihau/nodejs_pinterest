const passwordRegExp =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const EmailRegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

module.exports = {
  passwordRegExp,
  EmailRegExp,
};
