const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: String, 
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String, 
    default: 'system'
  },
  relatedItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ItemDetails',
    required: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
