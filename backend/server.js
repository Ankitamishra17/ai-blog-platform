const express = require("express");
require("dotenv").config();

//const { default: mongoose } = require("mongoose");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
//const User = require("./models/userSchema");
const userRoute = require("./routes/userRoutes");
const blogRoute = require("./routes/blogRoutes.js");
const cloudinaryConfig = require("./config/cloudinaryConfig.js");
const app = express();
// const dotenv = require('dotenv');
// dotenv.config();

// const PORT = process.env.PORT
// console.log("PORT" , process.env)

app.use(express.json()); // when send string data in json form than use this middleware
app.use(cors());

app.use("/api/v1", userRoute);
app.use("/api/v1", blogRoute);

// async function dbConnect(){
//   try{
//       await mongoose.connect("mongodb://localhost:27017/blogDatabase");
//       console.log("Database connected successfully")
//   }
//   catch (error){
//       console.log("ERROR")
//   }
// }

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: {
//     type:String,
//     unique :true
//   },
//   password: String
// })

// const User = mongoose.model("User", userSchema);

//users routes
// let users = []; this used when data base was not connected

// app.post("/users", async (req, res) => {
//   const { name, password, email } = req.body;
//   try {

//     //console.log(req.body)
//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: "please enter the name",
//       });
//     }

//     if (!password) {
//       return res.status(400).json({
//         success: false,
//         message: "please enter the password",
//       });
//     }

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "please enter email",
//       });
//     }
// // this is use for check email is already exist or not--
//     const  checkForexistingUser = await User.findOne({email});
//     if(checkForexistingUser) {
//       return res.status(400).json({
//         success: false,
//       message: "User already registered with this email",
//       })
//     }

//     //users.push({ ...req.body, id: users.length + 1 }); === it is use when database not connected

//     const newUser = await User.create({
//       // if name and value are same than give only one
//       // name :name,
//       // email:email,
//       // password:password
//       name,
//       email,
//       password
//     })
//     return res.status(200).json({
//       success: true,
//       message: "User created Successfully",
//       newUser
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "please try again",
//       error : err.message
//     });
//   }
// });

// app.get("/users", async (req, res) => {
//   try {
//      //db call
//     const users = await User.find({})

//     return res.status(200).json({
//       success: true,
//       message: "Users fetched successfully",
//       users,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "please try again",
//     });
//   }
// });

// app.get("/users/:id",async (req, res) => {
//   try {
//     //db call
//     const id = req.params.id

//     const user = await User.findById(id)
//     //console.log(user)

//     //console.log(user._id); this is give=====   new Object('udguddyuxvzsgqcvzyucvui')
//      //console.log(user.id); this is give===== udguddyuxvzsgqcvzyucvui
//     //const user1 = await User.findOne()

//     if (!user) {
//       return res.status(200).json({
//         success: false,
//         message: "users not found",

//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Users fetched successfully",
//       user,
//     });

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "please try again",
//       error : err.message
//     });
//   }
// });
// app.patch("/users/:id", async(req,res) =>{
//   try{
//       //db call
//       const id = req.params.id
//       const{name,password,email} = req.body
//       const updatedUser = await User.findByIdAndUpdate(id, {name,password,email}, {new:true})

//       if (!updatedUser) {
//       return res.status(200).json({
//         success: false,
//         message: "users not found",

//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Users Updated Successfully",
//       updatedUser,
//     });

//     }catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "please try again",
//       error : err.message
//     });
//   }

// })
// app.delete("/users/:id", async (req,res) =>{
//   try{
//     //db call
//       const id = req.params.id
//       //const{name,password,email} = req.body
//       const deletedUser = await User.findByIdAndDelete(id)

//       if (!deletedUser) {
//       return res.status(200).json({
//         success: false,
//         message: "users not found",

//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Users Deleted Successfully",
//       deletedUser,
//     });

//   }catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "please try again",
//       error : err.message
//     });
//   }
// })

// app.listen(3000 ,()=>{
//     console.log("Server Started");
// })

//blogs routes

//const blogs = [];

// app.post("/blogs", (req, res) => {
//   //console.log("BODY:", req.body);
//   blogs.push({ ...req.body, id: blogs.length + 1 });
//   return res.json({ message: "blog created successfully" });
// });

// app.get("/blogs", (req, res) => {
//   let publishBlogs = blogs.filter((blog) => !blog.draft);
//   return res.json({ publishBlogs });
// });

// app.get("/blogs/:id", (req, res) => {
//   const { id } = req.params;
//   let searchBlog = blogs.filter((blog) => blog.id == id);
//   return res.json({ searchBlog });
// });

// app.patch("/blogs/:id", (req, res) => {
//   const { id } = req.params;
//   // let index = blogs.findIndex(blog => blog.id == id)
//   // blogs[index] = {...blogs[index] , ...req.body}
//   //console.log(blogs)
//   //other method to update
//   let updatedBlogs = blogs.map((blog, index) =>
//     blog.id == id ? { ...blogs[index], ...req.body } : blog
//   );

//   blogs = [...updatedBlogs];
//   return res.json({ message: "Blog updated successfully", updatedBlogs });
// });

// app.delete("/blogs/:id", (req, res) => {
//   const { id } = req.params;
//   const index = blogs.findIndex((blog) => blog.id == id);

//   // if (index === -1) {
//   //   return res.status(404).json({ message: "Blog not found" });
//   // }

//   blogs.splice(index, 1);

//   res.json({ message: "Blog deleted successfully" });
// });

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
  dbConnect();
  cloudinaryConfig();
});
