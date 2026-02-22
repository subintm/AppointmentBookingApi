const express = require('express');
const cors = require('cors');
const protect = require('./middlewares/auth.middleware');

const app = express();
app.use(cors());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: "API is running successfully 🚀" });
});


app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/services', protect, require('./routes/service.routes'));
app.use('/api/appointments', protect, require('./routes/Appointment.route'));
app.use('/api/availability', protect, require('./routes/availabilityRoute'));
// error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

module.exports = app;