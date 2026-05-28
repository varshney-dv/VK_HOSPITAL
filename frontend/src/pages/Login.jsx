import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

const Login = () => {
  const [loading,setLoading]=useState(false);
  const {token,setToken,backendUrl}=useContext(AppContext)
  const navigate=useNavigate()
  const [state,setState]=useState('Sign Up')

  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');

  const [btnWidth, setBtnWidth] = useState(() => {
    const initialWidth = Math.min(382, window.innerWidth - 96);
    return initialWidth < 200 ? 200 : initialWidth;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(382, window.innerWidth - 96);
      const safeWidth = width < 200 ? 200 : width;
      setBtnWidth(safeWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGoogleCallback = async (response) => {
    setLoading(true);
    try {
      const googleToken = response.credential;
      const { data } = await axios.post(`${backendUrl}/api/user/google-login`, { token: googleToken });
      if (data.success && data.success !== 'false') {
        toast.success("Google login successful!");
        localStorage.setItem('token', data.token);
        setToken(data.token);
        navigate('/');
      } else {
        toast.error(data.message || "Google Authentication failed");
      }
    } catch (error) {
      console.error("Google Login callback error: ", error);
      toast.error(error.response?.data?.message || error.message || "Google Authentication failed");
    }
    setLoading(false);
  };

  useEffect(() => {
    const initializeGoogleBtn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '821100669086-i3sino00n1tpig858t7apkdig5u9cagq.apps.googleusercontent.com',
          callback: handleGoogleCallback,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { 
            theme: 'outline', 
            size: 'large', 
            width: btnWidth, 
            text: state === 'Sign Up' ? 'signup_with' : 'signin_with',
            shape: 'rectangular',
          }
        );
      }
    };

    if (window.google) {
      initializeGoogleBtn();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogleBtn();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [backendUrl, btnWidth, state]);

  const onSubmitHandler=async (event)=>{
    event.preventDefault();
    setLoading(true)
    try {
      if(state==='Sign Up'){
        const {data} = await axios.post(backendUrl+'/api/user/register',{name,password,email})
        if(data.success && data.success !== 'false'){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        } else{
          toast.error(data.message)
        }
      } 
      else{
        const {data} = await axios.post(backendUrl+'/api/user/login',{password,email})
        if(data.success && data.success !== 'false'){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        } else{
          toast.error(data.message)
        }
      }
      
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])


  return (
    <>
      {
      loading ? <Loading/> : <form onSubmit={onSubmitHandler} className=' min-h-[80vh] flex items-center' >
      <div className=' flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className=' text-2xl font-semibold'>{state==='Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state==="Sign Up" ? "sign up":"login"} to book an appointment</p>
  
        {
          state==="Sign Up" &&
          <div className='w-full'>
          <p>Full Name</p>
          <input type="text" value={name} onChange={(e)=>{
            setName(e.target.value)
          }} required className=' border border-zinc-300 rounded w-full p-2 mt-1' />
        </div>
        }
  
        <div className='w-full'>
          <p>Email</p>
          <input type="text" value={email} onChange={(e)=>{
            setEmail(e.target.value)
          }} required className=' border border-zinc-300 rounded w-full p-2 mt-1' />
        </div>
  
        <div className='w-full'>
          <p>Password</p>
          <input type="text" value={password} onChange={(e)=>{
            setPassword(e.target.value)
          }} required className=' border border-zinc-300 rounded w-full p-2 mt-1' />
        </div>
  
        <button type='submit' className=' bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer'>{state==='Sign Up'?"Create Account":"Login"}</button>
  
        <div className="relative flex py-1 items-center w-full">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="flex-shrink mx-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-zinc-200"></div>
        </div>

        <div className="w-full flex justify-center mt-1">
            <div id="google-signin-btn" className="transition-all duration-300"></div>
        </div>

        {
          state==='Sign Up'
          ? <p>Already have and account? <span onClick={()=>{
            // console.log("clicked on login here")
            setState('Login')
          }} className=' text-primary underline cursor-pointer'>Login here</span></p>
          : <p>Create an new Account? <span onClick={()=>{
            // console.log("clicked on login here")
            setState('Sign Up')
            }} className=' text-primary underline cursor-pointer'>click here</span></p>
        }
      </div>
      </form>
    }
    </>
  )
}

export default Login