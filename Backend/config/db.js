const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://root:pass@127.0.0.1:27017/shopsmart');
    console.log("Db connected Successfully");
  } catch (err) {
    console.log("Error connecting to DB:", err);
    process.exit(1); // stop server if DB fails
  }
}

module.exports = connectDB
