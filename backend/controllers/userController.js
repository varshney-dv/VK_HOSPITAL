import validator from "validator"
import bcrypt from "bcryptjs"
// import bcrypt from "bcrypt"
import userModel from '../modules/userModel.js'
import jwt from "jsonwebtoken"
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../modules/doctorModel.js"
import appointmentModel from "../modules/appointmentModel.js"
import razorpay from "razorpay"
//API TO REGISTER USER
const registerUser= async (req,res) => {
    try {
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.json({success:false,message:"Invalid Credentials"})
        }
        //validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter a Valid email"})
        }
        //validating strong password
        if(password.length<8){
            return res.json({success:false,message:"Enter a Strong Password"})
        }

        //hashing user password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const userData={
            name,email,password:hashedPassword
        }

        const newUser=new userModel(userData);
        const user=await newUser.save()

        const token= jwt.sign({id:user._id},process.env.JWT_SECRET)
        
        res.json({success:true,token})

    } catch (error) {
        console.log("Error in Doctor List in userController ",error);
        res.json({success:"false",message:error.message})
    }
}

//API FOR LOGIN USER
const loginUser=async (req,res) => {
    try {
        const {email,password}=req.body
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(isMatch){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid Credentails"})
        }
    } catch (error) {
        console.log("Error in Doctor List in userController ",error);
        res.json({success:"false",message:error.message})
    }
}

//API FOR USER PROFILE DATA
const getProfile=async (req,res) => {
    try {
        const {userId}=req.body
        console.log("In fetching user profile userId is -",userId)
        const userData=await userModel.findById(userId).select('-password')
        res.json({success:true,userData})
    } catch (error) {
        console.log("Error in Get profile of user in userController ",error);
        res.json({success:"false",message:error.message})
    }
}

//API FOR UPDATE USER PROFILE
const updateProfile=async (req,res) => {
    try {
        const {userId,name,phone,address,dob,gender}=req.body
        const imageFile=req.file
        console.log("In update profile ",userId,name,phone,address,dob,gender,imageFile);
        if(!name && !phone && !dob && !address && !gender && !imageFile){
            return res.json({success:false,message:"Data Missing"});
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        if(imageFile){
            //upload image to cloudinary
            const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL=imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId,{image:imageURL});
        }
        res.json({success:true,message:"Profile Updated"})
    } catch (error) {
        console.log("Error in Get profile of user in userController ",error);
        res.json({success:"false",message:error.message})
    }
}

//API FOR BOOK APPOINTMENT
const bookAppointment=async (req,res) => {
    try {
        const {userId,docId,slotDate,slotTime}=req.body
        const docData = await doctorModel.findById(docId).select('-password')
        if(!docData.available){
            return res.json({success:false,message:'Doctor is not Available'})
        }
        const slots_booked=docData.slots_booked
        // checking for slots availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:'Slots is not available'})
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate]=[];
            slots_booked[slotDate].push(slotTime)
        }

        const userData= await userModel.findById(userId).select('-password')
        delete docData.slots_booked
        const appointmentData={
            userId,docId,userData,docData,amount:docData.fees,slotTime,slotDate,date:Date.now()
        }
        const newAppointment=new appointmentModel(appointmentData);
        await newAppointment.save()
        //update slots of docData
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:'Appointment Booked'})
    } catch (error) {
        console.log("Error in booking Appointment of user in userController ",error);
        res.json({success:"false",message:error.message})
    }
}

//API TO GET USER APPOINTMENT IN FRONTEND MY APPOINTMENT PAGE
const listAppointment=async (req,res) => {
    try {
        const {userId}=req.body
        console.log("Inside listAppointment ",userId)
        const appointments=await appointmentModel.find({userId});
        res.json({success:true,appointments})
    } catch (error) {
        console.log("Error in list Appointment of user in userController ",error);
        res.json({success:"false",message:error.message})
    }
}

//API FOR CANCEL APPOINTMENT BY USER
const cancelAppointment= async (req,res) => {
    try {
        const {userId,appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId);
        if(userId!==appointmentData.userId){
            return res.json({success:false,message:"Unauthirized access"})
        }
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //relasing doctor slot
        const {docId,slotDate,slotTime}=appointmentData
        const doctorData= await doctorModel.findById(docId)
        let slots_booked=doctorData.slots_booked
        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:"Appointment Cancelled"})
        
    } catch (error) {
        console.log("Error in Canceling Appointment of user in userController ",error);
        res.json({success:"false",message:error.message})
    }
}

//API FOR ENDPOINT TO MAKE PAYMENT USING RAZORPAY
const razorpayInstance=new razorpay(
    {
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET,
    }
)
const paymentRazorpay= async (req,res) => {

    try {
        const {appointmentId}=req.body
        console.log("In paymentRazorpay in userController ",appointmentId)
        const appointmentData=await appointmentModel.findById(appointmentId)
        if(!appointmentData || appointmentData.cancelled){
            return res.json({success:false,message:"Appointment not found or it is cancelled"})
        }

        //creating options for razorpay payments
        const options={
            amount:appointmentData.amount * 100,
            currency:process.env.CURRENCY,
            receipt:appointmentId
        }
        //Creation of an order
        const order = await razorpayInstance.orders.create(options);
        res.json({success:true,order})

    } catch (error) {
        console.log("Error in Payment gateway of user in userController ",error);
        res.json({success:"false",message:error.message})
    }

}

//API VERIFY PAYMENT OF RAZORPAY
const verifyRazorpay=async (req,res) => {
    try {
        const {razorpay_order_id}=req.body
        console.log("---verify---- razorpay_order_id ",razorpay_order_id)
        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id);
        console.log("---verify ---- OrderInfo ",orderInfo);
        if(orderInfo.status==='paid'){
            console.log("---yes paid -----")
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payyment:true})
            res.json({success:true,message:"Payment Successful"})
        }
        else{
            console.log("----else----")
            res.json({success:false,message:"Payment Failed"})
        }
    } catch (error) {
        console.log("Error in Verifying payment of user in userController ",error);
        res.json({success:"false",message:error.message})
    }
}


export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}