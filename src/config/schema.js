const signUpSchema = {
  schema: {
    body: {
      email: { type: "string" },
      password: { type: "string" },
    },
  },
};

const signInSchema = {
  schema: {
    body: {
      email: { type: "string" },
      password: { type: "string" },
    },
  },
};

module.exports = {
  signUpSchema,
  signInSchema,
};
