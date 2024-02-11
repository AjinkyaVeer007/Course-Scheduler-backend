import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user.routes.js";
import courseRoutes from "./src/routes/course.routers.js";
import scheduleRoutes from "./src/routes/schedule.routes.js";
import dbConnection from "./src/config/database.js";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/schedule", scheduleRoutes);

dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Backend served on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("Fail to serve backend", err);
  });
