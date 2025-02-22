import React from 'react';
import ReactLoading from 'react-loading';
 
const Spinner = ({ type, color }) => (
    <ReactLoading type={type} color={color}  />
);

const Loading=()=>(<div className='flex justify-center items-center bg-gray-200 h-screen'>
        <div className='flex gap-2'>
        <p className=' text-5xl text-black text-center'>Loading</p>
        <Spinner type={"spin"} color={'black'}></Spinner>
        </div>
        </div>)
 
export default Loading;