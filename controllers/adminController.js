const User = require("../models/User");
const LostItem = require("../models/LostItem");

exports.getStats = async (req, res) => {

        const totalUsers = await User.countDocuments();
        const totalItems = await LostItem.countDocuments();
        const lostItems = await LostItem.countDocuments({ lost_or_found: 'lost' });
        const foundItems = await LostItem.countDocuments({ lost_or_found: 'found' });
        const resolvedItems = await LostItem.countDocuments({ is_resolved: true });

        res.json({
            users: totalUsers,
            items: totalItems,
            lost: lostItems,
            found: foundItems,
            resolved: resolvedItems
        });
    
};

exports.getAllUsers = async (req, res) => {

        const users = await User.find().select("-password");
        res.json(users);

};

exports.getAllItems = async (req, res) => {

        const items = await LostItem.find().populate('claims.user_id', 'username');
        
        res.json(items);
};

exports.deleteItem = async (req, res) => {

        await LostItem.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Item deleted" });
};

exports.deleteUser = async (req, res) => {

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "User deleted" });

};
