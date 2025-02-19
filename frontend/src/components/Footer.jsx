import React from "react";
import { assets } from "../assets/assets";
import {Link} from 'react-router-dom'
const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* ----left section----- */}
        <div>
          <img src={assets.logo} alt="" className="mb-5 w-40" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            VK Hospital, officially known as <span className=" font-bold">Vimlesh Kishanlal Hospital</span> , is
            dedicated to providing high-quality healthcare with a patient-first
            approach. Equipped with modern medical technology and a team of
            experienced doctors, we ensure comprehensive medical care across
            various specialties.
          </p>
        </div>
        {/* ----center section----- */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-gray-800 cursor-pointer" >Home</li>
            <li><Link to={'/about'} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-gray-800 cursor-pointer">About Us</Link></li>
            <li><Link to={'/contact'} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-gray-800 cursor-pointer">Contact Us</Link></li>
            <li><Link to={'/privacy'} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-gray-800 cursor-pointer">Privacy Policy</Link></li>
          </ul>
        </div>
        {/* ----right section----- */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+91-8077925406</li>
            <li>code37dv@gmail.com</li>
          </ul>
        </div>
      </div>
      {/* ------CopyRIght Text----- */}
      <div>
        <hr />
        <p className="text-sm text-center py-5">
          Copyright 2025 @ Code.dv - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
