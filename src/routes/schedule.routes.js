import express from "express";
import {
  deleteSchedule,
  getScheduledCourse,
  schedule,
} from "../controller/courseschedule.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/new/:userType/:userId", auth, schedule);
router.delete("/delete/:userType/:id", auth, deleteSchedule);
router.get("/get/:userType/:userId", auth, getScheduledCourse);

export default router;
