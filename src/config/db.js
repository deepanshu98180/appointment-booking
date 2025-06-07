const mongoose = require("mongoose");
global.ObjectId = mongoose.Types.ObjectId;

const env = require("./env");
const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log("+ MongoDB Connected");
    } catch (error) {
        console.error("X Database Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
