const UserModel = require("../models/UserModel");

const gamesController = {
  win: async (req, res) => {
    try {
      const u = await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        { ...req.user._doc, wins: req.user.wins + 1 }
      );
      console.log(u)
      return res.status(200).send({ success: true });
    } catch (errorWin) {
      return res
        .status(500)
        .send({ success: false, msg: "Something went wrong during win" });
    }
  },
  lost: async (req, res) => {
    try {
      await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        { ...req.user._doc, losts: req.user.losts + 1 }
      );
      return res.status(200).send({ success: true });
    } catch (errorLost) {
      return res
        .status(500)
        .send({ success: false, msg: "Something went wrong during lost" });
    }
  },
};

module.exports = gamesController;
