const mongoose = require("mongoose");

const lostSchema = new mongoose.Schema({
  user_who_registered: { type: String, required: true },
  is_resolved: { type: Boolean, required: true },
  lost_or_found: { type: String, required: true },
  name: { type: String, required: true },
  place: { type: String, required: true },
  time: { type: String, required: true },
  contact: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: String, required: true },
  image_url: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  reward: { type: String },
  security_question: { type: String },
  security_answer_hash: { type: String },
  claims: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    status: { type: String, default: 'pending' }, 
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model("Lost_data", lostSchema);
