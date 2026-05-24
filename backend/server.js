import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import userRouter from "./routes/userRoute.js"
import aiRouter from "./routes/aiRoute.js"
//app config
const app=express()

const port=process.env.PORT || 4000
connectDB()
connectCloudinary()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())    //allow frontend to connect with backend

//api endpoints
app.use('/api/admin',adminRouter)
// localhost:4000/api/admin

app.use('/api/doctor',doctorRouter);
// localhost:4000/api/doctor

app.use('/api/user',userRouter)
// localhost:4000/api/user

app.use('/api/ai',aiRouter)
// localhost:4000/api/ai

app.get('/',(req,res)=>{
    res.send("API WORKING GREAT")
})

app.listen(port,()=>console.log("Server started, port is: ",port))