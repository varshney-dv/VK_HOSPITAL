import React, { useContext, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import Privacy from './components/Privacy'
import axios from 'axios'
import { AppContext } from './context/AppContext'
import video1 from './assets/loading_laptop.mp4'
import video2 from './assets/loading_mobile.mp4'
const App = () => {
  const {backendUrl}=useContext(AppContext);
  const [wakeUp,setWakeup]=useState(false);

  useEffect(() => {
    console.log("ENTER IN FETCHDATA")
    const fetchData = async () => {
      try {
        const { data } = await axios.get(backendUrl + '/api/user/wake-up');
        
        if (data.success) {
          toast.success("You are connected with the server");
          setWakeup(true);
          console.log(data.message);
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error("Server connection failed");
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {
        wakeUp ?
        <div className='mx-4 sm:mx-[10%]' >
    <ToastContainer/>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/doctors' element={<Doctors/>} />
      <Route path='/doctors/:speciality' element={<Doctors/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/about' element={<About/>} />
      <Route path='/contact' element={<Contact/>} />
      <Route path='/privacy' element={<Privacy/>} />
      <Route path='/my-profile' element={<MyProfile/>} />
      <Route path='/my-appointments' element={<MyAppointments/>} />
      <Route path='/appointment/:docId' element={<Appointment/>} />
    </Routes>
    <Footer/>
    </div>
    : 
    <div className="fixed top-0 left-0 w-full h-full">
    <video autoPlay muted loop className="w-full h-full object-cover md:hidden">
    <source src={video2} type="video/mp4" />
  </video>
  <video autoPlay muted loop className="w-full h-full object-cover hidden md:block">
    <source src={video1} type="video/mp4" />
  </video>
</div>
      }
    </>
  )
}

export default App