import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  oneTimePassword: {
    type: String,
    default: null,
  },
  isPasswordChange: {
    type: String,
    default: false,
  },
  userType: {
    type: String,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
