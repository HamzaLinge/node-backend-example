const UserModel = require("../models/UserModel");
const generateToken = require("../utils/jwtHelper");
const sendEmail = require("../utils/sendEmail");

const waitingUsersToConfirmTheirEmail = [];

const authController = {
  login: async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).send({
          success: false,
          msg: "Please enter your email and your password",
        });
      }
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).send({success: false, msg: "User not found"});
      }
      if (!user.matchPassword(req.body.password)) {
        return res.status(401).send({success: false, msg: "Password incorrect"});
      }
      return res
        .status(200)
        .send({ success: true, token: generateToken(user._id) });
    } catch (errorLogin) {
      return res
        .status(500)
        .send({ success: false, msg: "Something went wrong during login" });
    }
  },
  register: async (req, res) => {
    try {
      if (
        !req.body.email ||
        !req.body.password ||
        !req.body.firstName ||
        !req.body.lastName
      ) {
        return res.status(400).send({
          success: false,
          msg: "Please enter all your information",
        });
      }
      // Check if the user is already registered in the database
      const user = await UserModel.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(403)
          .send({ success: false, msg: "This address email is already used" });
      }
      // Check if this user has already registered, but still to confirm his address email
      if (
        waitingUsersToConfirmTheirEmail.find((u) => u.email === req.body.email)
      ) {
        return res.status(403).send({
          success: false,
          msg: "You already submitted your registration, please confirm it with the code that has sent to your email address",
        });
      }
      // Generate the confirmation code, send it and save the user information, waiting his confirmation
      const confirmationCode = Math.floor(Math.random() * 900000) + 100000;
      await sendEmail(req.body.email, confirmationCode);
      waitingUsersToConfirmTheirEmail.push({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        confirmationCode,
      });
      // Register successfully
      return res.status(200).send({ success: true });
    } catch (errorRegister) {
      return res
        .status(500)
        .send({ success: false, msg: "Something went wrong during register" });
    }
  },
  validateEmail: async (req, res) => {
    try {
      if (!req.body.email || !req.body.code) {
        return res.status(400).send({
          success: false,
          msg: "Please enter all your email and your confirmation code",
        });
      }
      const waitingUser = waitingUsersToConfirmTheirEmail.find(
        (u) => u.email === req.body.email
      );
      if (!waitingUser) {
        return res
          .status(404)
          .send({ success: false, msg: "There is no email to confirm" });
      }
      if (waitingUser.confirmationCode !== req.body.code) {
        return res
          .status(500)
          .send({ success: false, msg: "Your confirmation code is incorrect" });
      }
      const newUser = await UserModel.create({
        ...waitingUser,
        confirmationCode: undefined,
      });
      return res
        .status(200)
        .send({ success: true, token: generateToken(newUser._id) });
    } catch (errorConfirmRegistration) {
      return res.status(500).send({
        success: false,
        msg: "Something went wrong during confirm registration",
      });
    }
  },
};

module.exports = authController;
