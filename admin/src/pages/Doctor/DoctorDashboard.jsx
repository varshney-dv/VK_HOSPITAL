import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const { dashData, setDashData, getDashData, dToken ,cancelAppointment,completeAppointment} =
    useContext(DoctorContext);
  const { currency, slotdateFormat } = useContext(AppContext);
  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  if (!dashData) {
    return <p>Loading....</p>;
  }

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2 items-center bg-white p-4 min-w-52 rounded border-2 cursor-pointer border-gray-100 hover:scale-105 transition-all">
          <img src={assets.earning_icon} className="w-14" alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {currency} {dashData.earnings || 0}
            </p>
            <p className="text-gray-400">Earning</p>
          </div>
        </div>

        <div className="flex gap-2 items-center bg-white p-4 min-w-52 rounded border-2 cursor-pointer border-gray-100 hover:scale-105 transition-all">
          <img src={assets.appointment_icon} className="w-14" alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData.appointments || 0}
            </p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex gap-2 items-center bg-white p-4 min-w-52 rounded border-2 cursor-pointer border-gray-100 hover:scale-105 transition-all">
          <img src={assets.patients_icon} className="w-14" alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData.patients || 0}
            </p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      <div className=" bg-white">
        <div className=" flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className=" font-semibold">Latest Bookings</p>
        </div>

        <div className=" pt-4 border border-t-0">
          {dashData.latestAppointments.map((item, index) => (
            <div
              key={index}
              className=" flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
            >
              <img
                src={item.userData.image}
                className=" rounded-full w-10"
                alt=""
              />
              <div className=" flex-1 text-sm">
                <p className=" text-gray-800 font-medium">
                  {item.userData.name}
                </p>
                <p className=" text-gray-600">
                  {slotdateFormat(item.slotDate)}
                </p>
              </div>
              {item.cancelled ? (
                <p className=" text-red-600 text-sm font-medium">Cancelled</p>
              ) : item.isComplete ? (
                <p className=" text-green-500 text-sm font-medium">Completed</p>
              ) : (
                <div className="flex">
                  <img
                    src={assets.cancel_icon}
                    className=" w-10 cursor-pointer hover:scale-105"
                    alt=""
                    onClick={() => cancelAppointment(item._id)}
                  />
                  <img
                    src={assets.tick_icon}
                    className=" w-10 cursor-pointer hover:scale-105"
                    alt=""
                    onClick={() => completeAppointment(item._id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
