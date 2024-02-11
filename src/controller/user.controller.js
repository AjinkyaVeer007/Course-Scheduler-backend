import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Courseschedule from "../models/courseschedule.model.js";

const saltRounds = 10;

const ObjectId = mongoose.Types.ObjectId;

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      userType,
      adminId,
      oneTimePassword,
      isPasswordChange,
    } = req.body;

    if (!name || !email || !password || !userType) {
      return res.status(400).json({
        message: "All fields are mandatory",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exist, please login",
        success: false,
      });
    }

    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      password: encryptedPassword,
      oneTimePassword,
      userType,
      adminId,
      isPasswordChange,
    });

    return res.status(200).json({
      message: "You have registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are mandatory",
        success: false,
      });
    }

    const user = await User.findOne({ email }).select("-createdAt -updatedAt");

    if (!user) {
      return res.status(400).json({
        message: "You need to register first",
        success: false,
      });
    }

    let comparePassword;
    if (user.isPasswordChange) {
      comparePassword = await bcrypt.compare(password, user.password);
    } else {
      comparePassword = password === user.oneTimePassword;
    }

    if (!comparePassword) {
      return res.status(400).json({
        message: "Password is invalid",
        success: false,
      });
    }

    const token = await jwt.sign(
      {
        _id: user._id,
      },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: process.env.TOKEN_EXPIRY }
    );

    user.password = undefined;

    return res.status(200).json({
      data: user,
      token: token,
      message: "User login successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email id",
        success: false,
      });
    }

    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    await User.findByIdAndUpdate(user?._id, {
      isPasswordChange: true,
      password: encryptedPassword,
    });

    res.status(200).json({
      success: true,
      message: "Password changes successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userType = req.params.userType;
    if (!userType === "admin") {
      return res.status(400).json({
        message: "Unauthorized user",
        success: false,
      });
    }
    const docsToDelete = await Courseschedule.aggregate([
      {
        $match: {
          assignTo: new ObjectId(req.params.id),
        },
      },
    ]);

    for (const doc of docsToDelete) {
      await Courseschedule.findByIdAndDelete(doc._id);
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { userType, userId } = req.params;

    if (userType !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Unauthorised User",
      });
    }

    const users = await User.aggregate([
      {
        $match: {
          adminId: new ObjectId(userId),
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          oneTimePassword: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Users fetch successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
