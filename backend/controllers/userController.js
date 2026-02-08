const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { generateJWT, verifyJWT } = require("../utils/generateJWT");
//const transporter = require("../utils/transporter")
const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "blogapp-84aef",
    private_key_id: "1a535e2fee7fde2ee4bff3d9cb085cb40607c80c",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCe0gWazyyqJ3sh\nGpPDfD+KKoYgW8dhvx72cfWUOsgEJIf5P930fMRU3aqaZyFaA6OHydpUuAi3PTm1\n2/A3SUs+7WkY8F4Cmy33h7fyAsRgHCclTvqYqSZpHasil6MrJoS2JfQ/RMLj5Prm\nnHOv5w4AUZMibqpC8Xa6+cI3UcOuuhZ1gAsD4eT9+ULrtMjt31clnDn3Q0BQyh3x\nOoToCp1mK1BwWY7qYuBUuCmLE+gOb21uCZJQywRPWooME2rSLDeM+euw9U+DXALE\nWeFWQEpUm+s58cSdfelWzDNSo78NM6qmEkyiYfXXLlBus7Di6SoJAzIbjMqC8QAc\ntoWMlB+BAgMBAAECggEAJNEqFHOvdnh1jjyDgZ81eZmXAzxTcaDlFBth4y1nPbKc\nRNcd5HXh64yBZo6+yAes6qcL8nTBLH1IehSU0LQwedN+eBYMrQz9MHMpXLRwgpk0\nJ+1xoV8g9OA4UmoVnMSuoi0VPG97wGnOEhS1qtLkx4UhlytRU/h23ixU7g8JzmCe\nZiyLOZKND8vpWXCyPwP/WsaznCAOMFRzUjGHwGA1SD2TrOWuotr5x1jUOZps5rPw\nsb8hzxA5k4qz4xMM96a2Dqiom7Dbm3z3IB4lybRok/bnSOf5PjmB/lfT/e6CicDH\nyAiZXAYlt4qbGkkDoyXLasoff3qydMeFd6C3r7OkCwKBgQDYuTFKPmOzrb+oTOyb\nrW85Er7BrI7kW1WLN1J2abj+cHD4Yvojm8CBd8cpwjJiiDvfXWiNkmEhpG6lDQ+g\nGzMkSkV93OUu9AqKlpsdVmpzl/jvkAIFAe58hV3ow/W+4E5S3vB0po4scJzP/HFS\nDCNOPYy6Glcnn1uWICQUiln6gwKBgQC7mnBydzFcYrgDbIZY8x/G4GfUopF5Otwi\nHu+H3DOduORPtArp66t8ABs98Eh6Qe9A5TMvwncvvKsugoZj7Hyjye8oGpdL1ZVQ\n1OFAaJL/MmVoTTrFvw0q6yoXic9U0au2v/1Y9Gm54vyGVl6uM6L+dGVegiD4Z8AT\nOs5SkdzuqwKBgAxSSxkbfvOiNzlMVk9rht1J0YqVUvJstupZVNjind/paKLWjb4k\nhsdVlf8ryU2MzUqftugFoHwXKys7GN5TbY7sohLL0kPfIBJNCbibRyYXR9Hm8BZ0\ny6hMtNAdBAW8HvfbMPSQ25hvNpskkRTHF+LE4RFbmgTorH5WiXaZfxAdAoGAKEsX\nc75d/7XESBf7EwfE/3YbVvRDwoH93eY/FDMbcvjPML8+yNcxUcTEFR2Ss4+Nz6Zq\nxAtEhiBDtA2cx8F3U8Z/c2GitUr+cwoGB0tupxkv5qMPyIEsVteDhuK2gUU3WF0M\nERsNyjsSedf7Jfc5PuXJD+9rHW9LNdYfkmR5y1kCgYEAtJc+wrsA+beXk8SyHb0s\nvAwdZ9ChY+SqT4juJJHB5wGvIcN8StER2fHU9bg9wzWCv2h5vI39CAeOHXyXzhaJ\n0O1nlUbKCMYs8rbLmGIEqSGlbdMJXtl6nwZABfjQ+9PzsupeRW27rke0Uupo1Xi3\nuHO72BRWaSH0pLlg6sAGwGw=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-fbsvc@blogapp-84aef.iam.gserviceaccount.com",
    client_id: "115295341815641300933",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40blogapp-84aef.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  }),
});

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
      { new: true }
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
    const { accessToken } = req.body;

    console.log("Received accessToken:", accessToken);

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access token missing",
      });
    }

    // Verify the token with Google
    const googleUser = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    );

    const { name, email, picture } = googleUser.data;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google authentication failed. No email returned.",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleAuth) {
        return res.status(400).json({
          success: false,
          message: "Email already registered with password",
        });
      }

      // User exists and uses Google Auth → login
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

    // Create new Google-auth user
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

    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
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
      checkForexistingUser.password
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
      { new: true }
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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  verifyToken,
  googleAuth,
};
