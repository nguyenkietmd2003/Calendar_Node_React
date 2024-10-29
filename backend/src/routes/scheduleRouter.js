import express from "express";
import {
  createSchedule,
  deleteSchedule,
  getAllSchedule,
  updateSchedule,
} from "../controllers/scheduleController.js";

const scheduleRouter = express.Router();

scheduleRouter.get("/get-schedule", getAllSchedule);
scheduleRouter.post("/create-schedule", createSchedule);
scheduleRouter.post("/update-schedule/:id", updateSchedule);
scheduleRouter.post("/delete-schedule/:id", deleteSchedule);
// shared Links
scheduleRouter.post("/shared-schedule/:id", deleteSchedule);

export default scheduleRouter;
