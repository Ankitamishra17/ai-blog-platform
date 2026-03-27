// const express = require("express");
// require("dotenv").config();

// //const { default: mongoose } = require("mongoose");
// const cors = require("cors");
// const dbConnect = require("./config/dbConnect");
// //const User = require("./models/userSchema");
// const userRoute = require("./routes/userRoutes");
// const blogRoute = require("./routes/blogRoutes.js");
// const authRoutes = require("./routes/authRoutes.js");
// const cloudinaryConfig = require("./config/cloudinaryConfig.js");
// const app = express();

// // const PORT = process.env.PORT
// // console.log("PORT" , process.env)

// app.use(express.json()); // when send string data in json form than use this middleware
// // app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// );

// app.use("/api/v1", userRoute);
// app.use("/api/v1", blogRoute);
// app.use("/api/v1", authRoutes);

// app.listen(process.env.PORT || 3000, () => {
//   console.log("Server Started");
//   dbConnect();
//   cloudinaryConfig();
// });

// const express = require("express");
// require("dotenv").config();
// const cors = require("cors");

// const dbConnect = require("./config/dbConnect");
// const userRoute = require("./routes/userRoutes");
// const blogRoute = require("./routes/blogRoutes");
// const authRoutes = require("./routes/authRoutes");
// const cloudinaryConfig = require("./config/cloudinaryConfig");

// const app = express();

// // ✅ Allowed origins
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://ai-blog-platform-seven.vercel.app",
// ];

// // ✅ CORS middleware (IMPORTANT)
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true); // allow Postman

//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("CORS not allowed"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }),
// );

// // ✅ Handle preflight requests (VERY IMPORTANT)
// // app.options("/*", cors());
// app.use(express.json());

// // ✅ Routes
// app.use("/api/v1", userRoute);
// app.use("/api/v1", blogRoute);
// app.use("/api/v1", authRoutes);

// // ✅ Start server
// app.listen(process.env.PORT || 3000, () => {
//   console.log("Server Started");
//   dbConnect();
//   cloudinaryConfig();
// });

const express = require("express");
require("dotenv").config();
const cors = require("cors");

const dbConnect = require("./config/dbConnect");
const userRoute = require("./routes/userRoutes");
const blogRoute = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const cloudinaryConfig = require("./config/cloudinaryConfig");

const app = express();

// ✅ CORS (ONLY ONCE — CLEAN VERSION)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-blog-platform-seven.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], // 🔥 IMPORTANT
  }),
);

// ✅ Handle preflight requests (VERY IMPORTANT)
app.options("*", cors());

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/v1", userRoute);
app.use("/api/v1", blogRoute);
app.use("/api/v1", authRoutes);

// ✅ Debug (optional but helpful)
app.use((req, res, next) => {
  console.log("HEADERS:", req.headers);
  next();
});

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
  dbConnect();
  cloudinaryConfig();
});
