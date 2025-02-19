import doctorModel from "../modules/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../modules/appointmentModel.js"
const changeAvailability=async (req,res) => {
    try {
        const {docId} = req.body
        const docData =await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:"Availability Changed"})     
    } catch (error) {
        console.log("Error in Admin Loging ",error);
        res.json({success:"false",message:error.message})
    }
}

const doctorList=async (req,res) => {
    try {
        const doctors=await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors});
    } catch (error) {
        console.log("Error in Doctor List in doctorController ",error);
        res.json({success:"false",message:error.message})
    }
}

//API FOR DOCTOR LOGIN
const loginDoctor=async (req,res) => {
    try {
        const {email,password}=req.body;
        const doctor = await doctorModel.findOne({email})
        if(!doctor){
            return res.json({success:false,message:"Invalid Credentials"})
        }
        const isMatch=await bcrypt.compare(password,doctor.password)
        if(isMatch){
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Wrong Password"})
        }
    } catch (error) {
        console.log("Error in loginDoctor",error)
        res.json({success:"false",message:error.message})
    }
}

//API FOR FETCH ALL APPOINTMENTS FOR DOCTOR PANEL
const appointmentsDoctor= async (req,res) => {
    try {
        const {docId}=req.body
        // console.log("In appointments doctor docId is ",docId)
        const appointments= await appointmentModel.find({docId})
        // console.log("In appointments doctor appointments are ",appointments)
        res.json({success:true,appointments})
    } catch (error) {
        console.log("Error in Fetching all apointment of doctor",error)
        res.json({success:false,message:error.message})
    }
}

//API TO MARK AN APPOINTMENT COMPLETE
const appointmentComplete= async (req,res) => {
    try {
        const {docId,appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
        // console.log("hiii",appointmentData)
        if(appointmentData && appointmentData.docId===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isComplete:true})
            res.json({success:true,message:"appointment complemeted"})
        }
        else{
            res.json({success:false,message:"appointment mark failed"})
        }
    } catch (error) {
        console.log("Error in marking appointment complete of doctor",error)
        res.json({success:false,message:error.message})
    }
}

//API TO MARK AN APPOINTMENT Cancel
const appointmentCancel= async (req,res) => {
    try {
        const {docId,appointmentId}=req.body
        // console.log("In appointment cancel in doctor controller ",docId,appointmentId)
        const appointmentData= await appointmentModel.findById(appointmentId)
        // console.log(appointmentData)
        if(appointmentData && appointmentData.docId===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            res.json({success:true,message:"appointment cancelled"})
        }
        else{
            res.json({success:false,message:"appointment cancellation failed"})
        }
    } catch (error) {
        console.log("Error in cancelling appointment complete of doctor",error)
        res.json({success:false,message:error.message})
    }
}

//API FOR DOCTOR DASHBOARD
const doctorDashboard = async (req,res) => {
    try {
        const {docId}=req.body
        const appointments= await appointmentModel.find({docId})

        let earnings=0
        appointments.map((item)=>{
            if(item.isComplete || item.payment){
                earnings+=item.amount
            }
        })

        let patients=[];
        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData={
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)

        }

        res.json({success:true,dashData})

    } catch (error) {
        console.log("Error in dashboard of doctor",error)
        res.json({success:false,message:error.message})
    }
}

//API FOR DOCTOR PROFILE
const doctorProfile = async (req,res) => {
    try {
        const {docId}=req.body
        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({success:true,profileData})
    } catch (error) {
        console.log("Error in fetching doctor profile",error)
        res.json({success:false,message:error.message})
    }
}

//API TO UPDATE DOCTOR PROFILE DATA FROM DOCTOR PANEL
const updateDoctorProfile = async (req,res) => {
    try {
        const {docId,fees,address,available}=req.body
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({success:true,message:"profile updated"})
    } catch (error) {
        console.log("Error in updating doctor profile",error)
        res.json({success:false,message:error.message})
    }
}

export {changeAvailability,doctorList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,
    doctorProfile,updateDoctorProfile
}