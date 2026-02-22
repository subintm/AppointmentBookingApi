const Availability = require('../models/availabilty.model');
const mongoose = require('mongoose');
const serviceModel = require('../models/service.model');
const  booked=  require('../models/AppointMent.model');



exports.createAvailability = async (req, res) => {
  try {
    const { serviceId, workingDays, startTime, endTime } = req.body.data;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "Invalid Service ID" });
    }

    const newAvailability = new Availability({
      serviceId,
      workingDays,
      startTime,
      endTime
    });

    await newAvailability.save();

    res.status(201).json({
      success: true,
      message: "Availability created successfully",
      data: newAvailability
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getAllAvailability = async (req, res) => {
  try {
    const data = await Availability.find().populate('serviceId');

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getAvailabilityByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await serviceModel.findById(serviceId);
    const availability = await Availability.findOne({ serviceId });

    if (!service || !availability) {
      return res.status(404).json({ message: "Missing data" });
    }

    const toMin = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const toTime = (mins) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h.toString().padStart(2,"0")}:${m
        .toString()
        .padStart(2,"0")}`;
    };

    const startMin = toMin(availability.startTime);
    const endMin = toMin(availability.endTime);
    const duration = Number(service.duration); // ✅ FIX

    const slots = [];
    let current = startMin;

    while (current + duration <= endMin) {
      slots.push(toTime(current));
      current += duration;
    }

    res.json({
      serviceName: service.name,
      serviceId: service._id,
      price: service.price,
      duration,
      startTime: availability.startTime,   // ✅ added
      endTime: availability.endTime,       // ✅ added
      workingDays: availability.workingDays,
      slots
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAvailabilityByServiceIdANDDate = async (req, res) => {
  try {
    const { serviceId, selectedDate } = req.params;

    const service = await serviceModel.findById(serviceId);
    const availability = await Availability.findOne({ serviceId });
    
    console.log("Service:", service);
    console.log("Availability:", availability);
    
    if (!service || !availability) {
      return res.status(404).json({ message: "Missing data" });
    }

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await booked.find({
      serviceId,
      date: { $gte: startOfDay, $lte: endOfDay },
      Status: { $in: ["BOOKED", "COMPLETED"] }
    });

    console.log("Booked Appointments:", bookedAppointments);

    // ---------- helpers ----------
    const toMin = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const toTime = (mins) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    };

    // ---------- generate all slots ----------
    const startMin = toMin(availability.startTime);
    const endMin = toMin(availability.endTime);
    const duration = Number(service.duration);

    const allSlots = [];
    let current = startMin;

    while (current + duration <= endMin) {
      allSlots.push(toTime(current));
      current += duration;
    }

    // ---------- FIXED: Check if selectedDate is TODAY ----------
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);

    let futureSlots = allSlots; // Default: all slots for future/past dates

    // Only filter past times if it's TODAY
    if (selectedDay.getTime() === today.getTime()) {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, "0");
      const currentMinutes = now.getMinutes().toString().padStart(2, "0");
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      console.log("Current time (today):", currentTimeStr);

      // Filter only future slots for TODAY
      futureSlots = allSlots.filter(slot => {
        const slotMin = toMin(slot);
        const currentMin = toMin(currentTimeStr);
        return slotMin >= currentMin;
      });
    }

    console.log("Future slots after date check:", futureSlots);

    // ---------- normalize booked slots ----------
    const bookedSlots = bookedAppointments.map(a => {
      const slot = a.slot.toString().trim();
      return slot.endsWith(':') ? slot.slice(0, -1) : slot;
    });

    // ---------- available slots ----------
    const availableSlots = futureSlots.filter(
      slot => !bookedSlots.includes(slot)
    );

    console.log("Final available slots:", availableSlots);

    res.json({
      ServiceId: serviceId,
      ServiceName: service.name,
      Date: selectedDate,
      IsToday: selectedDay.getTime() === today.getTime(), // Debug info
      BookedSlots: bookedSlots,
      AvailableSlots: availableSlots
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Availability.findByIdAndUpdate(
      id,
      req.body.data,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Availability not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Availability.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Availability not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Availability deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};