import { useState } from "react"
import { createContext } from "react"
import axios from "axios"
export const DoctorContext=createContext()
import {toast} from 'react-toastify'
const DoctorContextProvider=(props)=>{
    const [dToken,setDToken]=useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'')
    const [appointments,setAppointments]=useState([])
    const [dashData,setDashData]=useState(false)
    const [profileData,setProfileData]=useState(false)
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const getAppointments=async () => {
        try {
            // console.log("Inside getAppointments")
            const {data}=await axios.get(backendUrl+'/api/doctor/appointments',{headers:{dToken}})
            console.log("data is ",data)
            if(data.success){
                setAppointments(data.appointments);
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const completeAppointment=async (appointmentId) => {
        console.log("hi")
        try {
            console.log("Hii ",appointmentId)
            const {data}= await axios.post(backendUrl+'/api/doctor/complete-appointment',{appointmentId},{headers:{dToken}})
            if(data.success){
                toast.success(data.message)
                getAppointments();

            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const cancelAppointment=async (appointmentId) => {
        try {
            // console.log("hii ",appointmentId)
            const {data}= await axios.post(backendUrl+'/api/doctor/cancel-appointment',{appointmentId},{headers:{dToken}})
            // console.log("data is ",data)
            if(data.success){
                toast.success(data.message)
                getAppointments();
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const getDashData=async () => {
        try {
            const {data}=await axios.get(backendUrl+'/api/doctor/dashboard',{headers:{dToken}})
            // console.log(data)
            if(data.success){
                setDashData(data.dashData);
                // console.log(data.dashData)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const getProfileData= async () => {
        try {
            const {data}=await axios.get(backendUrl+'/api/doctor/profile',{headers:{dToken}})
            console.log(data)
            if(data.success){
                setProfileData(data.profileData);
                // console.log(data.profileData);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value={
        dToken,setDToken,backendUrl,getAppointments,appointments,setAppointments,completeAppointment,
        cancelAppointment,dashData,setDashData,getDashData,profileData,setProfileData,getProfileData
    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider