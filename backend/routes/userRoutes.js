
const express = require("express");
const {createUser , getAllUsers, getUserById,updateUser,deleteUser, login,verifyToken, verifyEmail,googleAuth} = require("../controllers/userController");
const User = require("../models/userSchema");
const route = express.Router();

route.post("/signup", createUser );
route.post("/signin", login );

route.get("/users", getAllUsers);
route.get("/users/:id", getUserById );

route.patch("/users/:id", updateUser);
route.delete("/users/:id", deleteUser );

//verify email/token

route.get("/verify-email/:verificationToken",verifyToken)
//route.get("/verify-email/:verificationToken",verifyEmail)

//google auth 

 route.post("/google-auth", googleAuth)

module.exports = route