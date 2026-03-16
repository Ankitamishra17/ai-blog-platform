// const { message } = require("antd");
const { verifyJWT } = require("../utils/generateJWT");

const verifyUser = async (req, res, next) => {
  try {
    // console.log("vrify User middlewares");
    // let token = req.headers.authorization.replace("Bearer","");
    //OR

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Please sign in",
      });
    }

    const token = authHeader.split(" ")[1];
    //  let token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Please sign in",
      });
    }
    try {
      let user = await verifyJWT(token);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Please sign in",
        });
      }

      // req.user = user.id; // attach user ID to request

      req.user = user;
      //console.log(req.user);
      next(); // pass control to next middleware/handler
    } catch (err) {
      console.error(err);
      return res.status(401).json({
        success: false,
        message: "Token verification failed",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "missing token",
    });
  }
};

// next() this is use for next step

module.exports = verifyUser;
