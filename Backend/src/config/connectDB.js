import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connection succesfull");
    } catch (error) {
        console.log("Error in connecting to the database");
        console.log(error)
    }
}

export default connectDB;