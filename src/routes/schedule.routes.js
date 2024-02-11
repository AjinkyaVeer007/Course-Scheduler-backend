import express from "express";
import {
  deleteSchedule,
  schedule,
} from "../controller/courseschedule.controller.js";

const router = express.Router();

router.post("/new/:userType/:userId", schedule);
router.delete("/delete/:userType/:id", deleteSchedule);

export default router;
