import mongoose from "mongoose";

export default async function dbConnect() {
    if(mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("🥂💃🏿 Connected to MongoDB successfully");
    } catch (error) {
        console.log("❌🚮😢 Error connecting to MongoDB:", error);
        
    }
}