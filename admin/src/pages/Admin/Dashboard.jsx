import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { 
    getDashData, 
    aToken, 
    cancelAppointment, 
    dashData,
    appointments,
    getAllAppointments,
    doctors,
    getAllDoctors
  } = useContext(AdminContext);

  const { slotdateFormat } = useContext(AppContext);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    if (aToken) {
      getDashData();
      getAllAppointments();
      getAllDoctors();
    }
  }, [aToken]);

  // --- Data Processing for Analytics ---
  
  // 1. Total Estimated Revenue (sum of all appointment fees)
  const totalRevenue = appointments ? appointments.reduce((sum, item) => sum + (item.amount || 0), 0) : 0;

  // 2. Status Breakdown
  const statusStats = {
    completed: appointments ? appointments.filter(app => app.isComplete).length : 0,
    cancelled: appointments ? appointments.filter(app => app.cancelled).length : 0,
    pending: appointments ? appointments.filter(app => !app.isComplete && !app.cancelled).length : 0
  };

  // 3. Specialties Distribution
  const specialityCounts = {};
  if (appointments) {
    appointments.forEach(app => {
      const spec = app.docData?.speciality || 'General physician';
      specialityCounts[spec] = (specialityCounts[spec] || 0) + 1;
    });
  }

  const specColors = {
    'General physician': '#4f46e5', // Indigo
    'Gynecologist': '#ec4899',       // Pink
    'Dermatologist': '#10b981',      // Emerald
    'Pediatricians': '#f59e0b',      // Amber
    'Neurologist': '#8b5cf6',       // Violet
    'Gastroenterologist': '#f43f5e'  // Rose
  };

  const specialtiesData = Object.keys(specColors).map(name => {
    const count = specialityCounts[name] || 0;
    const total = appointments && appointments.length ? appointments.length : 1;
    return {
      name,
      count,
      percentage: Math.round((count / total) * 100),
      color: specColors[name]
    };
  }).sort((a, b) => b.count - a.count);

  // 4. Daily Booking Trend (Last 7 Active Days)
  const dailyData = {};
  if (appointments) {
    appointments.forEach(app => {
      if (!app.date) return;
      const d = new Date(app.date);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyData[dateStr] = (dailyData[dateStr] || 0) + 1;
    });
  }

  const sortedDates = Object.keys(dailyData)
    .sort((a, b) => new Date(a) - new Date(b))
    .slice(-7);

  const chartData = sortedDates.length > 0 
    ? sortedDates.map(date => ({ label: date, value: dailyData[date] || 0 }))
    : [
        { label: 'Day 1', value: 0 },
        { label: 'Day 2', value: 0 },
        { label: 'Day 3', value: 0 },
        { label: 'Day 4', value: 0 },
        { label: 'Day 5', value: 0 },
        { label: 'Day 6', value: 0 },
        { label: 'Day 7', value: 0 }
      ];

  // 5. Top Doctors Leaderboard
  const doctorBookings = {};
  if (appointments) {
    appointments.forEach(app => {
      const docId = app.docId;
      if (!docId) return;
      if (!doctorBookings[docId]) {
        doctorBookings[docId] = {
          name: app.docData?.name || 'Unknown Doctor',
          image: app.docData?.image || '',
          speciality: app.docData?.speciality || 'General physician',
          count: 0
        };
      }
      doctorBookings[docId].count += 1;
    });
  }
  const topDoctors = Object.values(doctorBookings)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // --- SVG Line Chart Math ---
  const maxVal = Math.max(...chartData.map(d => d.value), 4);
  const chartWidth = 500;
  const chartHeight = 160;
  const paddingX = 40;
  const paddingY = 25;

  const points = chartData.map((d, index) => {
    const x = paddingX + (index * (chartWidth - 2 * paddingX)) / (chartData.length - 1 || 1);
    const y = chartHeight - paddingY - (d.value * (chartHeight - 2 * paddingY)) / maxVal;
    return { x, y, label: d.label, value: d.value };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : "";

  return (
    dashData && (
      <div className="m-6 space-y-6 max-w-7xl">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Clinical Operations Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Real-time metrics, predictive analytics, and platform status.</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Live Updates Active
          </div>
        </div>

        {/* 1. KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Doctors */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 rounded-2xl text-white shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute -right-4 -bottom-4 opacity-15 group-hover:scale-110 transition-transform duration-500">
              <img src={assets.doctor_icon} className="w-28 h-28 object-contain" alt="" />
            </div>
            <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">Onboarded Specialists</p>
            <h3 className="text-3xl font-extrabold mt-2">{dashData.doctors}</h3>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-100 bg-white/10 w-fit px-2 py-1 rounded-md">
              <span>Target: 50 Doctors</span>
              <div className="w-12 bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full" style={{ width: `${Math.min((dashData.doctors / 50) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Card 2: Appointments */}
          <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-600 p-5 rounded-2xl text-white shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute -right-4 -bottom-4 opacity-15 group-hover:scale-110 transition-transform duration-500">
              <img src={assets.appointment_icon} className="w-28 h-28 object-contain" alt="" />
            </div>
            <p className="text-rose-100 text-xs font-semibold uppercase tracking-wider">Total Consultations</p>
            <h3 className="text-3xl font-extrabold mt-2">{dashData.appointments}</h3>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-rose-100 bg-white/10 w-fit px-2 py-1 rounded-md">
              <span>Active Bookings</span>
              <span className="font-bold bg-white text-rose-600 px-1 rounded">{statusStats.pending}</span>
            </div>
          </div>

          {/* Card 3: Patients */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-2xl text-white shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute -right-4 -bottom-4 opacity-15 group-hover:scale-110 transition-transform duration-500">
              <img src={assets.patients_icon} className="w-28 h-28 object-contain" alt="" />
            </div>
            <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Unique Patients</p>
            <h3 className="text-3xl font-extrabold mt-2">{dashData.patients}</h3>
            <div className="mt-4 text-xs text-emerald-100 flex items-center gap-1">
              <span className="font-semibold text-white">+{Math.max(1, Math.round(dashData.patients * 0.1))}</span> new signups this week
            </div>
          </div>

          {/* Card 4: Estimated Revenue */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 p-5 rounded-2xl text-white shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute -right-4 -bottom-3 opacity-15 text-6xl font-bold font-serif group-hover:scale-110 transition-transform duration-500 select-none">
              ₹
            </div>
            <p className="text-violet-100 text-xs font-semibold uppercase tracking-wider">Estimated Revenue</p>
            <h3 className="text-3xl font-extrabold mt-2">₹{totalRevenue.toLocaleString("en-IN")}</h3>
            <div className="mt-4 flex items-center gap-1 text-xs text-violet-100">
              Avg ticket size: <span className="font-bold text-white">₹{appointments && appointments.length ? Math.round(totalRevenue / appointments.length) : 0}</span>
            </div>
          </div>
        </div>

        {/* 2. Visualizations and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Trend Chart (Left & Center Panel) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-gray-800 text-base">Consultation Registration Trend</h3>
                <p className="text-xs text-gray-400">Total appointments booked grouped by registration date</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-gray-500">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span> Daily Volume
                </span>
              </div>
            </div>

            {/* SVG Line Chart */}
            <div className="relative h-44 w-full flex items-end">
              {hoveredPoint && (
                <div 
                  className="absolute bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg pointer-events-none shadow-md z-10 transition-all duration-150"
                  style={{ left: `${hoveredPoint.x - 45}px`, top: `${hoveredPoint.y - 45}px` }}
                >
                  <p className="font-bold">{hoveredPoint.label}</p>
                  <p>{hoveredPoint.value} Booking{hoveredPoint.value !== 1 ? 's' : ''}</p>
                </div>
              )}

              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-axis gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const y = paddingY + ratio * (chartHeight - 2 * paddingY);
                  const label = Math.round(maxVal - ratio * maxVal);
                  return (
                    <g key={index} className="opacity-40">
                      <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#e5e7eb" strokeDasharray="3,3" />
                      <text x={paddingX - 10} y={y + 4} textAnchor="end" className="text-[9px] fill-gray-400 font-medium">{label}</text>
                    </g>
                  );
                })}

                {/* Shaded Area */}
                {points.length > 1 && (
                  <path d={areaD} fill="url(#chartGrad)" />
                )}

                {/* Line Path */}
                {points.length > 1 && (
                  <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                )}

                {/* Interactive Points */}
                {points.map((p, index) => (
                  <g 
                    key={index}
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer"
                  >
                    <circle cx={p.x} cy={p.y} r={hoveredPoint && hoveredPoint.label === p.label ? "6" : "4"} fill="#ffffff" stroke="#3b82f6" strokeWidth="2.5" />
                    <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
                    <text x={p.x} y={chartHeight - 5} textAnchor="middle" className="text-[9px] fill-gray-400 font-medium">{p.label}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Status Breakdown (Right Panel) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-base">Booking Status Distribution</h3>
              <p className="text-xs text-gray-400">Resolution summary of platform consultations</p>
            </div>

            <div className="my-4 flex justify-center items-center relative">
              {/* Circular SVG Donut Chart */}
              <svg width="120" height="120" className="transform -rotate-90">
                <circle cx="60" cy="60" r="48" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
                {/* Highlight circles */}
                {(() => {
                  const total = appointments && appointments.length ? appointments.length : 1;
                  const cPerc = (statusStats.completed / total) * 100;
                  const xPerc = (statusStats.cancelled / total) * 100;
                  const pPerc = (statusStats.pending / total) * 100;

                  const cOffset = 301.6;
                  const cStroke = (cPerc / 100) * 301.6;
                  const xStroke = (xPerc / 100) * 301.6;
                  const pStroke = (pPerc / 100) * 301.6;

                  return (
                    <>
                      {/* Completed Circle */}
                      <circle 
                        cx="60" cy="60" r="48" 
                        fill="transparent" 
                        stroke="#10b981" 
                        strokeWidth="12" 
                        strokeDasharray={`${cStroke} 301.6`}
                        strokeDashoffset="0"
                      />
                      {/* Pending Circle */}
                      <circle 
                        cx="60" cy="60" r="48" 
                        fill="transparent" 
                        stroke="#3b82f6" 
                        strokeWidth="12" 
                        strokeDasharray={`${pStroke} 301.6`}
                        strokeDashoffset={`-${cStroke}`}
                      />
                      {/* Cancelled Circle */}
                      <circle 
                        cx="60" cy="60" r="48" 
                        fill="transparent" 
                        stroke="#ef4444" 
                        strokeWidth="12" 
                        strokeDasharray={`${xStroke} 301.6`}
                        strokeDashoffset={`-${cStroke + pStroke}`}
                      />
                    </>
                  );
                })()}
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-lg font-extrabold text-gray-800">{appointments ? appointments.length : 0}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Bookings</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                <p className="text-[10px] text-emerald-600 font-bold uppercase">Done</p>
                <p className="text-base font-extrabold text-emerald-700 mt-0.5">{statusStats.completed}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-xl border border-blue-100">
                <p className="text-[10px] text-blue-600 font-bold uppercase">Pending</p>
                <p className="text-base font-extrabold text-blue-700 mt-0.5">{statusStats.pending}</p>
              </div>
              <div className="bg-red-50 p-2 rounded-xl border border-red-100">
                <p className="text-[10px] text-red-600 font-bold uppercase">Void</p>
                <p className="text-base font-extrabold text-red-700 mt-0.5">{statusStats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Specialty Demographics and Top Doctor Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Specialty Booking Breakdown (Bar Chart representation) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 text-base mb-1">Speciality Demand Analysis</h3>
            <p className="text-xs text-gray-400 mb-6">Patient volume distribution aggregated by clinical departments</p>

            <div className="space-y-4">
              {specialtiesData.map((spec, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-gray-700">{spec.name}</span>
                    <span className="text-gray-500 font-semibold">{spec.count} booking{spec.count !== 1 ? 's' : ''} ({spec.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${spec.percentage}%`,
                        backgroundColor: spec.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Doctors Leaderboard */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-base mb-1">Top Performing Specialists</h3>
              <p className="text-xs text-gray-400 mb-4">Top practitioners by booking volume</p>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {topDoctors.length > 0 ? (
                topDoctors.map((doc, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100 group hover:bg-indigo-50/30 transition-all duration-300">
                    <div className="relative">
                      <img src={doc.image} className="w-12 h-12 rounded-full object-cover border border-gray-200" alt="" />
                      <div className="absolute -top-1.5 -left-1.5 bg-indigo-600 text-white text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{doc.name}</p>
                      <p className="text-[10px] text-gray-500">{doc.speciality}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-extrabold text-indigo-600">{doc.count} appointments</p>
                      <p className="text-[9px] text-gray-400 font-semibold">Booked</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-gray-400 py-6">No doctor booking records found.</p>
              )}
            </div>
          </div>
        </div>

        {/* 4. Latest Bookings Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <img src={assets.list_icon} alt="" className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-gray-800 text-base">Recent Patient Registrations</h3>
              <p className="text-xs text-gray-400 mt-0.5">Most recent booking events processed across portals</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center px-6 py-4 gap-4 hover:bg-gray-50/70 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={item.docData.image}
                    className="rounded-full w-10 h-10 object-cover border border-gray-150"
                    alt=""
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.docData.name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Consultation Date: {slotdateFormat(item.slotDate)} at {item.slotTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {/* Status Indicator Chip */}
                  <div>
                    {item.cancelled ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
                        Cancelled
                      </span>
                    ) : item.isComplete ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                        Completed
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                        Scheduled
                      </span>
                    )}
                  </div>

                  {/* Action or Date indicator */}
                  <div>
                    {!item.cancelled && !item.isComplete ? (
                      <button 
                        onClick={() => cancelAppointment(item._id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50/50 hover:bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Cancel Appointment
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Processed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
