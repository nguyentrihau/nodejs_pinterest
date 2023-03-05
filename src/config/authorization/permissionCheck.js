const { failCode } = require("../response");
const { modeAuth, adminAuth } = require("./adminAuthorization");

const moderatorPermissionCheck = async (req, res) => {
  const valid = await modeAuth(req);
  let message;
  if (!valid) message = "Không đủ quyền";
  if (message) return failCode(res, message);
};

const adminPermissionCheck = async (req, res) => {
  const valid = await adminAuth(req);
  let message;
  if (!valid) message = "Không đủ quyền";
  if (message) return failCode(res, message);
};

module.exports = {
  moderatorPermissionCheck,
  adminPermissionCheck,
};
