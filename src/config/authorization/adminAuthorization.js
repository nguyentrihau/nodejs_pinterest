const { PrismaClient } = require("@prisma/client");
const { getUserIDFromToken } = require("../function");
const { failCode } = require("../response");
const model = new PrismaClient();

const adminAuth = async (req) => {
  const { authorization } = req.headers;
  const currentUserId = getUserIDFromToken(authorization);
  const currentUser = await model.users.findFirst({
    where: {
      user_id: currentUserId,
    },
  });
  if (currentUser.permission === 4) return true;
  return false;
};

const bannedCheck = async (req, res) => {
  const { authorization } = req.headers;
  const currentUserId = getUserIDFromToken(authorization);
  const userInfo = await model.users.findFirst({
    where: {
      user_id: currentUserId,
    },
  });

  if (userInfo.permission === 0)
    return failCode(res, "Banned user không thể thực hiện hành động này!");
};

const checkPermissionByToken = async (req, res) => {
  let valid = await adminAuth(req);
  let message;
  if (!valid) message = "Không đủ quyền";
  if (message) return failCode(res, message);
};

module.exports = { adminAuth, bannedCheck, checkPermissionByToken };
