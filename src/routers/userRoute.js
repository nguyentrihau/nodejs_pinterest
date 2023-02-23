const { signUpSchema, signInSchema } = require("../config/schema");
const { signUp, signIn } = require("../controllers/userControllers");

const userRoute = async (server) => {
  server.post("/signUp", { ...signUpSchema }, signUp);
  server.post("/signIn", { ...signInSchema }, signIn);
};

module.exports = userRoute;
