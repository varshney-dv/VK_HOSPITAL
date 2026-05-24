import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // ✅ Added dropdown state

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      {/* ---- Desktop Menu ---- */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/"><li className="py-1">Home</li></NavLink>
        <NavLink to="/doctors"><li className="py-1">All Doctors</li></NavLink>
        <NavLink to="/ai-checker"><li className="py-1">AI Checker</li></NavLink>
        <NavLink to="/about"><li className="py-1">About</li></NavLink>
        <NavLink to="/contact"><li className="py-1">Contact</li></NavLink>
      </ul>

      {/* ---- Right Section ---- */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)} // ✅ Toggle dropdown
            >
              <img src={userData.image} alt="profile-pic" className="w-8 rounded-full" />
              <img src={assets.dropdown_icon} alt="" className="w-2.5" />
            </div>

            {/* ---- Dropdown ---- */}
            {showDropdown && (
              <div className="absolute top-10 right-0 bg-stone-100 rounded flex flex-col gap-4 p-4 text-base font-medium text-gray-600 shadow-lg">
                <p onClick={() => {navigate("/my-profile"); setShowDropdown(false);}} className="hover:text-black cursor-pointer">
                  My Profile
                </p>
                <p onClick={() => {navigate("/my-appointments"); setShowDropdown(false);}} className="hover:text-black cursor-pointer">
                  My Appointment
                </p>
                <p onClick={() => {logout(); setShowDropdown(false);}} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => navigate("/login")} className="bg-primary text-white px-8 py-3 rounded-full cursor-pointer font-light hidden md:block">
            Create Account
          </button>
        )}

        {/* ---- Mobile Menu Icon ---- */}
        <img className="w-6 md:hidden cursor-pointer" onClick={() => setShowMenu(true)} src={assets.menu_icon} alt="" />

        {/* ---- Mobile Menu ---- */}
        <div className={`${showMenu ? "fixed w-full h-full" : "h-0 w-0"} md:hidden right-0 top-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} alt="" className="w-36" />
            <img src={assets.cross_icon} onClick={() => setShowMenu(false)} alt="" className="w-7" />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink to="/" onClick={() => setShowMenu(false)}><p className="px-4 py-2 rounded">Home</p></NavLink>
            <NavLink to="/doctors" onClick={() => setShowMenu(false)}><p className="px-4 py-2 rounded">All Doctors</p></NavLink>
            <NavLink to="/ai-checker" onClick={() => setShowMenu(false)}><p className="px-4 py-2 rounded">AI Checker</p></NavLink>
            <NavLink to="/about" onClick={() => setShowMenu(false)}><p className="px-4 py-2 rounded">About</p></NavLink>
            <NavLink to="/contact" onClick={() => setShowMenu(false)}><p className="px-4 py-2 rounded">Contact</p></NavLink>
            {!token && !userData && <NavLink to="/login" onClick={() => setShowMenu(false)}><p className="px-4 py-2 rounded">Login</p></NavLink> }
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
