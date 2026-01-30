const LostItem = require("../models/LostItem");
const authController = require("./authController");
const bcrypt = require("bcrypt");

exports.registerItem = async (req, res) => {

    const itemData = req.body;
    if (req.file) {
      itemData.image_url = `/uploads/${req.file.filename}`;
    }
    if (req.body.lat && req.body.lng) {
        itemData.coordinates = {
            lat: parseFloat(req.body.lat),
            lng: parseFloat(req.body.lng)
        };
    }
    const User = require("../models/User");
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: "User not found" });
    itemData.user_who_registered = user.username;
    if (itemData.security_answer_hash) {
        itemData.security_answer_hash = await bcrypt.hash(itemData.security_answer_hash, 10);
    }

    await LostItem.create(itemData);
    res.json({ status: "received" });

};

const Notification = require("../models/Notification");

exports.submitClaim = async (req, res) => {
        const { itemId, answer, message } = req.body;
        const userId = req.user.id;
        const User = require("../models/User");
        const claimer = await User.findById(userId);

        const item = await LostItem.findById(itemId);
        if (!item) return res.status(404).json({ error: "Item not found" });

        if (item.security_answer_hash) {
            const match = await bcrypt.compare(answer, item.security_answer_hash);
            if (!match) return res.status(403).json({ error: "Incorrect security answer" });
        }
        item.claims.push({
            user_id: userId,
            message: message,
            status: 'pending'
        });
        
        await item.save();
        await Notification.create({
            recipient: item.user_who_registered,
            message: `New claim on your item "${item.name}" by ${claimer ? claimer.username : 'Unknown'}. Message: ${message}`,
            type: 'claim',
            relatedItemId: item._id
        });
        res.json({ success: true, message: "Claim submitted successfully" });

};

exports.getClaims = async (req, res) => {
        const item = await LostItem.findById(req.params.id).populate('claims.user_id', 'username email');
        if (!item) return res.status(404).json({ error: "Item not found" }); 
        res.json({ claims: item.claims });

};

exports.getAllItems = async (req, res) => {
    const { type, sort, search } = req.body;
    let query = {
      is_resolved: { $ne: true }
    };
    if (type && type !== "all") {
      query.lost_or_found = type;
    } 
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    let sortOption = { _id: -1 }; 
    
    if (sort === "oldest") {
      sortOption = { _id: 1 };
    }

    const data = await LostItem.find(query)
      .sort(sortOption)
      .select("_id lost_or_found name timestamp description image_url place"); 

    res.json(data);

};

exports.getItemDetails = async (req, res) => {
    const item = await LostItem.findById(req.body.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);

};

exports.getAccountItems = async (req, res) => {
    const { user_who_registered } = req.body;
    let query = {};
    if (user_who_registered) {
        query.user_who_registered = user_who_registered;
    }
    const items = await LostItem.find(query);
    res.json(items);

};

exports.markResolved = async (req, res) => {
  const { info_id, case_resol_status } = req.body;
    await LostItem.updateOne(
      { _id: info_id },
      { is_resolved: case_resol_status }
    );
    res.json({ success: true });

};

exports.getArchivedItems = async (req, res) => {
    const { username } = req.body;
    const items = await LostItem.find({
      user_who_registered: username,
      is_resolved: true
    }).sort({ _id: -1 });
    
    res.json(items);

};
