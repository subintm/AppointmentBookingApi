const router = require('express').Router();
const { adminLogin } = require('../controller/admin.controller.js');

router.post('/adminLogin', adminLogin);
module.exports = router;