import express from "express";

const appointmentRouter = express.Router();
appointmentRouter.post("/book-appointment");
export default appointmentRouter;
