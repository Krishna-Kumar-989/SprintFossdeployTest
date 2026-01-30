const Notification = require('../models/Notification');

const User = require('../models/User');

exports.getNotifications = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: "User not found" });
    const notifications = await Notification.find({ recipient: user.username }).sort({ timestamp: -1 });
    res.json(notifications);

};

exports.markAsRead = async (req, res) => {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true });
};
