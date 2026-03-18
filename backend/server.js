const express = require("express");
require("dotenv").config();

//const { default: mongoose } = require("mongoose");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
//const User = require("./models/userSchema");
const userRoute = require("./routes/userRoutes");
const blogRoute = require("./routes/blogRoutes.js");
const authRoutes = require( "./routes/authRoutes.js");
const cloudinaryConfig = require("./config/cloudinaryConfig.js");
const app = express();

// const PORT = process.env.PORT
// console.log("PORT" , process.env)

app.use(express.json()); // when send string data in json form than use this middleware
app.use(cors());

app.use("/api/v1", userRoute);
app.use("/api/v1", blogRoute);
app.use("/api/v1", authRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
  dbConnect();
  cloudinaryConfig();
});
