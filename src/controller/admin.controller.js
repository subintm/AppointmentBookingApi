const Admin = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
  try {
    console.log(req.body.data,'saddsas');
    
    const { name, password } = req.body.data;

   
    if (!name || !password) {
      return res.status(400).json({ message: "Name and password required" });
    }
    const admin = await Admin.findOne({ name });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }
   
    if (password !== admin.password) {

      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Admin login success",
      role: admin.role,
      UserId: admin._id,
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};