import mongoose from "mongoose";
const connectDB=async () => {
    try {
        mongoose.connection.on('connected',()=>console.log("DATABASE CONNECTED"))
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`) 
    } catch (error) {
        console.log("Error in connecting Database ",error)
    }  
}

export default connectDB