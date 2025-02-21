import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { getDashData, aToken, cancelAppointment, dashData } =
    useContext(AdminContext);
  const { slotdateFormat } = useContext(AppContext);
  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);
  // console.log(dashData);
  return (
    dashData && (
      <div className=" m-5">
        <div className=" flex flex-wrap gap-3">
          <div className=" flex gap-2 items-center bg-white p-4 min-w-52  rounded border-2 cursor-pointer border-gray-100 hover:scale-105 transition-all">
            <img src={assets.doctor_icon} className=" w-14" alt="" />
            <div>
              <p className=" text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className=" text-gray-400">Doctors</p>
            </div>
          </div>

          <div className=" flex gap-2 items-center bg-white p-4 min-w-52  rounded border-2 cursor-pointer border-gray-100 hover:scale-105 transition-all">
            <img src={assets.appointment_icon} className=" w-14" alt="" />
            <div>
              <p className=" text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className=" text-gray-400">Appointments</p>
            </div>
          </div>

          <div className=" flex gap-2 items-center bg-white p-4 min-w-52  rounded border-2 cursor-pointer border-gray-100 hover:scale-105 transition-all">
            <img src={assets.patients_icon} className=" w-14" alt="" />
            <div>
              <p className=" text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className=" text-gray-400">Patients</p>
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
                  src={item.docData.image}
                  className=" rounded-full w-10"
                  alt=""
                />
                <div className=" flex-1 text-sm">
                  <p className=" text-gray-800 font-medium">
                    {item.docData.name}
                  </p>
                  <p className=" text-gray-600">
                    {slotdateFormat(item.slotDate)}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className=" text-xs  text-red-400 font-medium">
                    Cancelled
                  </p>
                ) : item.isComplete ? (
                  <p className="text-xs  text-green-400 font-medium">
                    Completed
                  </p>
                ) : (
                  <img
                    src={assets.cancel_icon}
                    className="w-10 cursor-pointer"
                    onClick={() => cancelAppointment(item._id)}
                    alt=""
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
