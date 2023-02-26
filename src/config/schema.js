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

const deleteImgSchema = {
  schema: {
    params: {
      img_id: {
        type: "number",
      },
    },
  },
};

const postCommentSchema = {
  schema: {
    body: {
      img_id: { type: "number" },
      comment_value: { type: "string" },
    },
  },
};

const editCommentSchema = {
  schema: {
    body: {
      comment_id: { type: "number" },
      comment_value: { type: "string" },
    },
  },
};

const deleteCommentSchema = {
  schema: {
    params: {
      comment_id: {
        type: "number",
      },
    },
  },
};
const saveImgSchema = {
  schema: {
    params: {
      img_id: {
        type: "number",
      },
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
  deleteImgSchema,
  postCommentSchema,
  deleteCommentSchema,
  editCommentSchema,
  saveImgSchema,
};
