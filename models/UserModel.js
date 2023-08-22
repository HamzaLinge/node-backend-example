const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  wins: { type: Number, default: 0 },
  losts: { type: Number, default: 0 },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hashSync(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

module.exports = mongoose.models.users || mongoose.model("users", userSchema);
