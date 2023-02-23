const signUpSchema = {
  schema: {
    body: {
      email: { type: "string" },
      password: { type: "string" },
      age: { type: "number" },
      user_name: { type: "string" },
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

const getUserInfoSchema = {
  schema: {
    params: {
      user_id: { type: "number" },
    },
  },
};

module.exports = {
  signUpSchema,
  signInSchema,
  getUserInfoSchema,
};
