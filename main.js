const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = 3000;

connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later."
});

//app.use(limiter);
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static("public/uploads")); 

app.use("/", authRoutes);   
app.use("/", require("./routes/itemRoutes")); 
app.use("/admin", adminRoutes); 
app.use("/api/notifications", require("./routes/notificationRoutes")); 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
