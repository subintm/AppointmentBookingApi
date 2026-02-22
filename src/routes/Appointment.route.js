// routes/appointmentRoutes.js

const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/Appointment.controller");

router.post("/insertAppointment", appointmentController.insertAppointment);
router.put("/updateAppointment/:id", appointmentController.updateAppointment);



router.get("/getAllappointments/by-date", appointmentController.getAppointmentsByDate);

router.get(
  "/getAllappointments/user/:userId/:date",
  appointmentController.getAppointmentsByUserIdAndDate
);

module.exports = router;