const {
  signUpSchema,
  signInSchema,
  getUserInfoSchema,
} = require("../config/schema");
const {
  signUp,
  signIn,
  getUserInfo,
  getCurrentUserInfo,
  getAllUsers,
} = require("../controllers/userControllers");
const { verifyToken } = require("../utils/jwtoken");

const userRoute = async (server) => {
  server.post("/signUp", { ...signUpSchema }, signUp);
  server.post("/signIn", { ...signInSchema }, signIn);
  server.get("/getUserInfo/:user_id", { ...getUserInfoSchema }, getUserInfo);
  server.get(
    "/getCurrentUserInfo",
    { preHandler: [verifyToken] },
    getCurrentUserInfo
  );
  server.get("/getAllUsers", {}, getAllUsers);
};

module.exports = userRoute;
