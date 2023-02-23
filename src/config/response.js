const moment = require("moment");

const successCode = (res, message, data) => {
  return res.code(200).send({
    message,
    ...(data && { content: data }),
    dateTime: moment().format(),
  });
};

const failCode = (res, message, data) => {
  return res.code(400).send({
    message,
    ...(data && { content: data }),
    dateTime: moment().format(),
  });
};

const errorCode = (res, message) => {
  return res.code(500).send({
    message,
    dateTime: moment().format(),
  });
};

module.exports = {
  successCode,
  failCode,
  errorCode,
};
