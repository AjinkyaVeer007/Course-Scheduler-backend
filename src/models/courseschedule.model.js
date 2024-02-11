import mongoose from "mongoose";

const courseScheduleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  assignBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignDate: {
    type: Date,
    required: true,
  },
});

const Courseschedule = mongoose.model("Courseschedule", courseScheduleSchema);

export default Courseschedule;
