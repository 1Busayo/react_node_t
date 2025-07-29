const mongoose = require('mongoose');

const UserLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // reference to User
  fullName: String,
  role: String,
  ipAddress: String,
  jwtToken: String,
  loginTime: { type: Date, default: Date.now },
  logoutTime: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('UserLog', UserLogSchema);