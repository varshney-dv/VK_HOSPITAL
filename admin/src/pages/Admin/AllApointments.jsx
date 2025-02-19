import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllApointments = () => {
  const {aToken,appointments,getAllAppointments,setAppointments,cancelAppointment}=useContext(AdminContext)
  const {calculateAge,slotdateFormat,currency}=useContext(AppContext)

  

  useEffect(()=>{
    if(aToken){
       getAllAppointments();
    }
  },[aToken])
  return (
    <div className=' m-5 max-w-6xl w-full'>
      <p className=' mb-3 text-lg font-medium'>All Appointments</p>
      <div className=' bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient Name</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor Name</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item,index)=>(
          <div key={index} className=' flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'>
          <p className=' max-sm:hidden'>{index+1}</p>
          <div className=' flex items-center gap-2'>
          <img src={item.userData.image} alt="" className='w-8 rounded-full' />
          <p>{item.userData.name}</p>
          </div>
          <p className=' max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
          <p>{slotdateFormat(item.slotDate)}, {item.slotTime}</p>
          <div className=' flex items-center gap-2'>
          <img src={item.docData.image} alt="" className='w-8 rounded-full bg-gray-200' />
          <p>{item.docData.name}</p>
          </div>
          <p>{currency} {item.amount}</p>
          {
            item.cancelled ? <p className=' text-xs  text-red-400 font-medium' >Cancelled</p> : item.isComplete ? <p className='text-xs  text-green-400 font-medium'>Completed</p> : <img src={assets.cancel_icon} className='w-10 cursor-pointer' onClick={()=>cancelAppointment(item._id)} alt="" />
          }
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllApointments