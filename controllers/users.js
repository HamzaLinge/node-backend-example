const UserModel = require("../models/UserModel");

const usersController = {
  getUsers: async (req, res) => {
    try {
      const users = await UserModel.find();
      if (users.length === 0) {
        return res.status(404).send({ success: false, msg: "No users found" });
      }
      return res.status(200).send({ success: true, data: users });
    } catch (errorGetUsers) {
      return res.status(500).send({
        success: false,
        msg: "Something went wrong during getting users",
      });
    }
  },
  getMe: async (req, res) => {
    try {
      return res.status(200).send({ success: true, data: req.user });
    } catch (errorGetMe) {
      return res.status(500).send({
        success: false,
        msg: "Something went wrong during getting your information",
      });
    }
  },
  updateMe: async (req, res) => {
    try {
      if (!req.body.firstName || !req.body.lastName || !req.body.password) {
        return res.status(400).send({
          success: false,
          msg: "Please enter your password and your new first and last names",
        });
      }
      if (!req.user.matchPassword(req.body.password)) {
        return res
          .status(401)
          .send({ success: false, msg: "Password incorrect" });
      }
      await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        {
          ...req.user._doc,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        }
      );
      return res.status(200).send({ success: true });
    } catch (errorUpdateMe) {
      return res.status(500).send({
        success: false,
        msg: "Something went wrong during updating your information",
      });
    }
  },
  deleteMe: async (req, res) => {
    try {
      await UserModel.findOneAndDelete({ _id: req.user._id });
      return res.status(200).send({ success: true });
    } catch (errorGetMe) {
      return res.status(500).send({
        success: false,
        msg: "Something went wrong during getting your information",
      });
    }
  },
  resetStats: async (req, res) => {
    try {
      await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        { ...req.user._doc, wins: 0, losts: 0 }
      );
      return res.status(200).send({ success: true });
    } catch (errorGetMe) {
      return res.status(500).send({
        success: false,
        msg: "Something went wrong during getting your information",
      });
    }
  },
};

module.exports = usersController;
