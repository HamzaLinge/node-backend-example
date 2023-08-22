const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { idUser } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(idUser);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, msg: "Unauthorized" });
  }
};

module.exports = protect;
