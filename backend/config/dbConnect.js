const mongoose = require("mongoose");

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    // console.log("ERROR")
    console.error(error.message);
  }
}

module.exports = dbConnect;
