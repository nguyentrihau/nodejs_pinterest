const multer = require("fastify-multer");
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.cwd()}/public/img`);
  },
  filename: (req, file, cb) => {
    const d = new Date();
    const newName = d.getTime() + "_" + file.originalname;
    cb(null, newName);
  },
});
const upload = multer({ storage });

const getUserIDFromToken = (token) => {
  let user_id = parseJwt(token.split("Bearer ")[1]);
  return user_id.user_id;
};

module.exports = {
  parseJwt,
  upload,
  getUserIDFromToken,
};
