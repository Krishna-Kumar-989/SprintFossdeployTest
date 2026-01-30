const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {

    if (req.path.startsWith("/api") || req.method === "POST") {
      return res.json({ error: "Not authorized, no token" });
    }
   
    req.user = null;
    return next(); 
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.clearCookie("token");
    if (req.path.startsWith("/api") || req.method === "POST") {
      return res.json({ error: "Not authorized, token failed" });
    }
    req.user = null;
    next();
  }
};


exports.requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.json({ error: "You must be logged in" });
  }
  next();
};

exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.json({ error: 'Admin access required' });
    }
};
