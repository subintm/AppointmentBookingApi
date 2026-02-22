
const router=require('express').Router();
const { createService, getAllServices, getServiceById, updateService, deleteService } = require('../controller/service.controller');

router.post('/insertService', createService);
router.put('/UpdateService/:id', updateService);
router.delete('/DeleteService/:id', deleteService);
router.get('/getAllServices', getAllServices);
router.get('/getServiceById/:id', getServiceById);

module.exports = router;