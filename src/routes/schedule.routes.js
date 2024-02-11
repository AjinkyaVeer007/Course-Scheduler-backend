import express from "express";
import {
  deleteSchedule,
  getScheduledCourse,
  schedule,
} from "../controller/courseschedule.controller.js";

const router = express.Router();

router.post("/new/:userType/:userId", schedule);
router.delete("/delete/:userType/:id", deleteSchedule);
router.get("/get/:userType/:userId", getScheduledCourse);

export default router;
