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

const deleteUserSchema = {
  schema: {
    params: {
      user_id: { type: "number" },
    },
  },
};

const banUserSchema = {
  schema: {
    params: {
      user_id: { type: "number" },
    },
  },
};
const getImgSchema = {
  schema: {
    params: {
      img_id: { type: "number" },
    },
  },
};

const setPermissionSchema = {
  schema: {
    body: {
      user_id: { type: "number" },
      permission_value: { type: "number" },
    },
  },
};

module.exports = {
  signUpSchema,
  signInSchema,
  getUserInfoSchema,
  deleteUserSchema,
  setPermissionSchema,
  banUserSchema,
  getImgSchema,
};
