const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_this_in_production";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" });
};




exports.signup = async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "" });

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(409).json({ error: "User or Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, role: 'user' });

   
    const token = generateToken(user._id, user.role);

   
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      maxAge: 24 * 60 * 60 * 1000 
    });

    res.json({ success: true, redirectUrl: "/dashboard" }); 

};




exports.login = async (req, res) => {

    const { username, password } = req.body; 
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    const query = isEmail ? { email: username } : { username };

    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ success: false, error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, error: "Invalid credentials" });

    const token = generateToken(user._id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 
    });

    res.json({ success: true, redirectUrl: "/dashboard" });

};

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
};

exports.checkAuth = async (req, res) => {

    
    if (!req.user) {
        return res.status(401).json({ authenticated: false });
    }
    
    
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
        res.clearCookie("token");
        return res.status(401).json({ authenticated: false });
    }

    res.json({ 
        authenticated: true, 
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });

};

exports.getFooter = exports.checkAuth; 

exports.getPublicProfile = async (req, res) => {

        const username = req.params.username;
        const user = await User.findOne({ username }).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

    
        const LostItem = require("../models/LostItem");
        const items = await LostItem.find({ user_who_registered: username });
        const lostCount = items.filter(i => i.lost_or_found === "lost").length;
        const foundCount = items.filter(i => i.lost_or_found === "found").length;

        
        res.json({
            username: user.username,
            email: user.email,
            role: user.role,
            stats: { lost: lostCount, found: foundCount },
            joined: user._id.getTimestamp()
        });

};

exports.updateProfile = async (req, res) => {

        const userId = req.user.id;
        const { bio, phone, email } = req.body;
        
        
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { bio, phone, email },
            { new: true, runValidators: true }
        ).select("-password");

        res.json({ success: true, user: updatedUser });

};
