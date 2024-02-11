import express from "express";
import {
  createCourse,
  deleteCourse,
  getcourse,
} from "../controller/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/create", upload.single("courseImg"), createCourse);
router.delete("/delete/:userType/:id", deleteCourse);
router.get("/get/:userType/:userId", getcourse);

export default router;
