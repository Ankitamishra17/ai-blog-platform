const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { generateJWT, verifyJWT } = require("../utils/generateJWT");
//const transporter = require("../utils/transporter")

const { getAuth } = require("firebase-admin/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const admin = require("../config/firebaseAdmin");
//const axios = require("axios");

async function createUser(req, res) {
  const { name, password, email } = req.body;
  try {
    //console.log(req.body)
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "please enter the name",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "please enter the password",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "please enter email",
      });
    }
    // this is use for check email is already exist or not--
    const checkForexistingUser = await User.findOne({ email });
    if (checkForexistingUser) {
      if (checkForexistingUser.googleAuth) {
        return res.status(400).json({
          success: true,
          message: "This Email is already registered",
        });
      }

      if (checkForexistingUser.verify) {
        return res.status(400).json({
          success: false,
          message: "User already registered with this email",
        });
      }
    }

    //users.push({ ...req.body, id: users.length + 1 }); === it is use when database not connected

    let salt = await bcrypt.genSalt(10);

    const hashedPass = await bcrypt.hash(password, salt);
    console.log(hashedPass);
    const newUser = await User.create({
      //     // if name and value are same than give only one
      //     // name :name,
      //     // email:email,
      //     // password:password
      name,
      email,
      password: hashedPass,
    });

    let verificationToken = await generateJWT({
      email: newUser.email,
      id: newUser._id,
    });

    // email logic send mail by usig nodemailer

    return res.status(200).json({
      success: true,
      message: "Please Check your email to verify user login", //"User created Successfully",
      // user: {
      //   id : newUser._id,
      //   name: newUser.name,
      //   email:newUser.email,
      //    token,
      // },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "please try again",
      error: err.message,
    });
  }
}

async function verifyToken(req, res) {
  try {
    const { verificationToken } = req.params;

    const verifyToken = await verifyJWT(verificationToken);
    if (!verifyToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token/Email expired",
      });
    }
    const { id } = verifyToken;
    const user = await User.findByIdAndUpdate(
      id,
      { isVerify: true },
      { new: true },
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "please try again",
      error: err.message,
    });
  }
}
async function googleAuth(req, res) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "ID token missing",
      });
    }

    // ✅ Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);
    console.log("DECODED:", decoded);

    const { name, email, picture } = decoded;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google authentication failed",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      const token = generateJWT({
        email: user.email,
        id: user._id,
      });

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          token,
        },
      });
    }

    const newUser = await User.create({
      name,
      email,
      googleAuth: true,
      avatar: picture,
      isVerify: true,
    });

    const token = generateJWT({
      email: newUser.email,
      id: newUser._id,
    });

    return res.status(200).json({
      success: true,
      message: "Registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token,
      },
    });
  } catch (err) {
    console.log("GOOGLE AUTH ERROR:", err);
    console.log("VERIFY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Google Auth Failed",
    });
  }
}

async function login(req, res) {
  const { password, email } = req.body;
  try {
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "please enter the password",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "please enter email",
      });
    }
    // this is use for check email is already exist or not--
    const checkForexistingUser = await User.findOne({ email });
    if (!checkForexistingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exist with this email",
      });
    }

    //users.push({ ...req.body, id: users.length + 1 }); === it is use when database not connected

    // if(!(checkForexistingUser.password == password)){
    //   return res.status(400).json({
    //   success: false,
    //   message: "Incorrect",

    // });
    // }

    if (checkForexistingUser.googleAuth) {
      return res.status(400).json({
        success: true,
        message: "This Email is already registered",
      });
    }

    let checkForPass = await bcrypt.compare(
      password,
      checkForexistingUser.password,
    );

    if (!checkForPass) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    let token = await generateJWT({
      email: checkForexistingUser.email,
      id: checkForexistingUser._id,
    });

    return res.status(200).json({
      success: true,
      message: "loged in Successfully",
      user: {
        id: checkForexistingUser._id,
        name: checkForexistingUser.name,
        email: checkForexistingUser.email,
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "please try again",
      error: err.message,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    //db call
    const users = await User.find({});

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "please try again",
      error: err.message,
    });
  }
}

async function getUserById(req, res) {
  try {
    //db call
    const id = req.params.id;

    const user = await User.findById(id);
    //console.log(user)

    //console.log(user._id); this is give=====   new Object('udguddyuxvzsgqcvzyucvui')
    //console.log(user.id); this is give===== udguddyuxvzsgqcvzyucvui
    //const user1 = await User.findOne()

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "users not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "please try again",
      error: err.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    //db call
    const id = req.params.id;
    const { name, password, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, password, email },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(200).json({
        success: false,
        message: "users not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Users Updated Successfully",
      updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "please try again",
      error: err.message,
    });
  }
}

async function deleteUser(req, res) {
  try {
    //db call
    const id = req.params.id;
    //const{name,password,email} = req.body
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(200).json({
        success: false,
        message: "users not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Users Deleted Successfully",
      deletedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "please try again",
      error: err.message,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Password Reset",
      `Click here to reset password:\n${resetUrl}`,
    );

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    // res.status(500).json({ message: "Error sending email" });

    console.log("FORGOT PASSWORD ERROR:", error); // 🔥 add this
    res.status(500).json({ message: error.message });
  }
}

async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  verifyToken,
  googleAuth,
  forgotPassword,
  resetPassword,
};
