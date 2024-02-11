import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "name is required"],
  },
  description: {
    type: String,
  },
  courseImg: {
    type: String,
    default: null,
  },
  level: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
