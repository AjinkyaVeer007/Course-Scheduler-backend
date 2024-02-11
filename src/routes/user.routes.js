import express from "express";
import {
  changePassword,
  deleteUser,
  getUsers,
  login,
  register,
} from "../controller/user.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/changepassword", changePassword);
router.delete("/delete/:userType/:id", auth, deleteUser);
router.get("/get/:userType/:userId", auth, getUsers);

export default router;
