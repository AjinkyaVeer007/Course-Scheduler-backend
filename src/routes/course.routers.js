import express from "express";
import {
  createCourse,
  deleteCourse,
  getcourse,
} from "../controller/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", auth, upload.single("courseImg"), createCourse);
router.delete("/delete/:userType/:id", auth, deleteCourse);
router.get("/get/:userType/:userId", auth, getcourse);

export default router;
