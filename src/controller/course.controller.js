import mongoose from "mongoose";
import Course from "../models/course.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const ObjectId = mongoose.Types.ObjectId;

export const deleteCourse = async (req, res) => {
  try {
    const userType = req.params.userType;

    if (!userType === "admin") {
      return res.status(400).json({
        message: "Unauthorized user",
        success: false,
      });
    }
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Course deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { name, description, level, userId } = req.body;

    if (!name || !level) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    const courseImgpath = req.file?.path;

    console.log(courseImgpath);

    const courseImg = await uploadOnCloudinary(courseImgpath);

    const course = await Course.create({
      name,
      description,
      level,
      createdBy: userId,
      courseImg: courseImg?.url,
    });

    res.status(200).json({
      success: true,
      message: "Course uploaded successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getcourse = async (req, res) => {
  try {
    const { userType, userId } = req.params;

    if (userType !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Unauthorised User",
      });
    }
    const courses = await Course.aggregate([
      {
        $match: {
          createdBy: new ObjectId(userId),
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: courses ? courses : [],
      message: "Courses fetch successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
