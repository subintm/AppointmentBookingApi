
const Appointment = require("../models/AppointMent.model");

exports.insertAppointment = async (req, res) => {
  try {
    const {
      UserId,
      name,
      age,
      date,
      slot,
      serviceName,
      serviceId,
      mobile,
      address,
      amount,
      Status,
    } = req.body.data;

    if (!name || !age || !date || !slot || !serviceName || !serviceId || !mobile || !address || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const appointment = new Appointment({
      UserId,
      name,
      age,
      date,
      slot,
      serviceName,
      serviceId,
      mobile,
      address,
      amount,
      Status 
    });

    const saved = await appointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment inserted successfully",
      data: saved
    });

  } catch (error) {
    console.error("Insert appointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params; // appointment id

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Appointment id is required"
      });
    }

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { $set: req.body.data },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updated
    });

  } catch (error) {
    console.error("Update appointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


exports.getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date is required"
      });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const data = await Appointment.find({
      date: { $gte: start, $lte: end }
    }).populate("serviceId");

    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error("Get by date error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};



exports.getAppointmentsByUserIdAndDate = async (req, res) => {
  try {
    const { userId, date } = req.params;

    const start = new Date(date);
    start.setHours(0,0,0,0);

    const end = new Date(date);
    end.setHours(23,59,59,999);

    const data = await Appointment.find({
      UserId: userId,
      date: { $gte: start, $lte: end }
    });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};