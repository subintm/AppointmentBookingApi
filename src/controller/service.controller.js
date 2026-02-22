
const service = require('../models/service.model.js');

exports.createService = async (req, res) => {
    try {
        const { name, duration, price } = req.body.data;
        const newService = new service({
            name,
            duration,
            price
        });
        await newService.save();
        res.status(201).json({ message: "Service created successfully", service: newService });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const services = await service.find();
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const serviceId = req.params.id;    
        const serviceData = await service.findById(serviceId);
        if (!serviceData) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json(serviceData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateService = async (req, res) => {   
    try {
        const serviceId = req.params.id;
        const { name, duration, price } = req.body.data;
        const updatedService = await service.findByIdAndUpdate(
            serviceId,
            { name, duration, price },
            { new: true }
        );
        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json({ message: "Service updated successfully", service: updatedService });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const deletedService = await service.findByIdAndDelete(serviceId);
        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json({ message: "Service deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

