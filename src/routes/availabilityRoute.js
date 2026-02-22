const express = require('express');
const router = express.Router();
const availabilityController = require('../controller/availabilty.controller');

router.post('/InsertAvailability', availabilityController.createAvailability);
router.get('/GettallAvailability', availabilityController.getAllAvailability);
router.get('/GetAvailabilityserviceId/:serviceId', availabilityController.getAvailabilityByServiceId);
router.get('/getAvailabilityByServiceIdANDDate/:serviceId/:selectedDate', availabilityController.getAvailabilityByServiceIdANDDate);

router.put('/updateAvailability/:id', availabilityController.updateAvailability);
router.delete('/deleteAvailability/:id', availabilityController.deleteAvailability);

module.exports = router;