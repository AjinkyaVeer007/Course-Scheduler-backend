import express from "express";
import {
  changePassword,
  deleteUser,
  getUsers,
  login,
  register,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/changepassword", changePassword);
router.delete("/delete/:userType/:id", deleteUser);
router.get("/get/:userType/:userId", getUsers);

export default router;
