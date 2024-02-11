import mongoose from "mongoose";
import Courseschedule from "../models/courseschedule.model.js";

const ObjectId = mongoose.Types.ObjectId;

export const schedule = async (req, res) => {
  try {
    const { assignBy, assignTo, assignDate, courseId } = req.body;

    if (!assignBy || !assignTo || !assignDate || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    const scheduledCourse = await Courseschedule.aggregate([
      {
        $match: {
          assignTo: new ObjectId(assignTo),
          assignDate: new Date(assignDate),
        },
      },
    ]);

    if (scheduledCourse.length) {
      return res.status(400).json({
        success: false,
        message: "Instructor already scheduled for lecture on selected date",
      });
    }

    await Courseschedule.create({
      assignTo,
      assignBy,
      assignDate: new Date(assignDate),
      courseId,
    });

    res.status(200).json({
      message: "Course scheduled successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const userType = req.params.userType;

    if (!userType === "admin") {
      return res.status(400).json({
        message: "Unauthorized user",
        success: false,
      });
    }
    await Courseschedule.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Schedule deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getScheduledCourse = async (req, res) => {
  try {
    const { userType, userId } = req.params;

    let courses = [];
    if (userType === "admin") {
      courses = await Courseschedule.aggregate([
        {
          $match: {
            assignTo: ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: {
            path: "$course",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assignTo",
            foreignField: "_id",
            as: "assignUser",
          },
        },
        {
          $unwind: {
            path: "$assignUser",
          },
        },
        {
          $project: {
            courseId: 0,
            assignTo: 0,
            assignBy: 0,
            "assignUser.password": 0,
            "assignUser.oneTimePassword": 0,
            "assignUser.isPasswordChange": 0,
            "assignUser.userType": 0,
            "assignUser.adminId": 0,
            "assignUser.__v": 0,
          },
        },
      ]);
    } else {
      courses = await Courseschedule.aggregate([
        {
          $match: {
            assignTo: ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: {
            path: "$course",
          },
        },
        {
          $project: {
            courseId: 0,
            assignTo: 0,
            assignBy: 0,
          },
        },
      ]);
    }

    req.status(200).json({
      data: courses ? courses : [],
      message: "Course fetch successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
