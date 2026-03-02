import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Code,
  Users,
  Mail,
  RefreshCcw,
    CreditCard, 
  X,
   MessageSquare
} from "lucide-react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_CODEIT_API_BASE;
const modules = [
  {
    key: "consultations",
    label: "Messages",
    icon: Users,
    api: `${API_BASE_URL}/consultation/getalldetails`,
  },
  {
    key: "newsletter",
    label: "News letter Emails",
    icon: Mail,
    api: `${API_BASE_URL}/newsletter/emaildetails`,
  },
  {
    key: "Payment",
    label: "Payment Details",
    icon: CreditCard,
    api: `${API_BASE_URL}/serviceselection/payments`,
  },
   {
    key: "contact",
    label: "Contact Form",
    icon: MessageSquare,
    api: `${API_BASE_URL}/contact/getcontact`,
  },

];


const formatDateTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const CodeItDashboard = ({ onBack }) => {
  const [activeModule, setActiveModule] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async (module) => {
    setLoading(true);
    setActiveModule(module);
    try {
      const res = await axios.get(module.api);
      const result = res.data.data || [];
      setData(result);
      setFilteredData(result);
    } catch {
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = data.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);
  useEffect(() => {
  // Open Messages (consultations) by default
  const defaultModule = modules.find(
    (module) => module.key === "consultations"
  );

  if (defaultModule) {
    fetchData(defaultModule);
  }
}, []);

  // Total Amount 
const totalReceivedAmount =
  activeModule?.key === "Payment"
    ? filteredData
        .filter((item) => item.paymentStatus === "paid")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto flex gap-6">

        {/* ---------------- SIDEBAR ---------------- */}
        <aside className="w-16 md:w-64 bg-slate-800 rounded-2xl p-4 space-y-3">
              <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-800 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Switch Website
            </button>
          {modules.map((module) => (
            
            <button
              key={module.key}
              onClick={() => fetchData(module)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl w-full transition ${
                activeModule?.key === module.key
                  ? "bg-emerald-600"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              <module.icon size={20} />
              <span className="hidden md:inline">{module.label}</span>
            </button>
          ))}
        </aside>

        {/* ---------------- MAIN ---------------- */}
        <main className="flex-1">

          {/* Header */}
          <header className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Code />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Code It Admin</h1>
                <p className="text-slate-400 text-sm">
                  {activeModule ? activeModule.label : "Admin Dashboard"}
                </p>
              </div>
            </div>

        
          </header>

          {/* Search + Refresh + Count */}
          {activeModule && (
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 w-full md:w-80"
              />

              <button
                onClick={() => fetchData(activeModule)}
                className="px-4 py-2 bg-slate-700 rounded-lg flex items-center gap-2"
              >
                <RefreshCcw size={16} /> Refresh
              </button>

<div className="ml-auto bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 shadow-md">
  <p className="text-xs text-slate-400">Total Records</p>
  <p className="text-xl font-bold text-white">
    {filteredData.length}
  </p>
</div>
              {activeModule.key === "Payment" && (
  <div className="ml-auto bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 shadow-md">
    <p className="text-xs text-slate-400">Total Amount Received</p>
    <p className="text-xl font-bold text-emerald-400">
      ₹{totalReceivedAmount.toLocaleString("en-IN")}
    </p>
  </div>
)}

            </div>
          )}

          {/* Table */}
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : activeModule ? (
            <div className="overflow-x-auto bg-slate-800 rounded-xl">
              <table className="w-full text-sm">
               <thead className="bg-slate-700">
               
  <tr>
    <th className="p-3 text-left">S.No</th>
    <th className="p-3 text-left">Email</th>

    {activeModule.key === "consultations" && (
      <>
     
        <th className="p-3 text-left">Name</th>
        <th className="p-3 text-left">Service</th>
      </>
    )}

    {activeModule.key === "Payment" && (
      <>
        <th className="p-3 text-left">Name</th>
        <th className="p-3 text-left">Category</th>
        <th className="p-3 text-left">Sub Category</th>
        <th className="p-3 text-left">Amount</th>
      </>
    )}


    {activeModule.key === "contact" && (
  <>
    <th className="p-3 text-left">Name</th>

    <th className="p-3 text-left">Message</th>
  </>
)}
    <th className="p-3 text-left">Date</th>
  </tr>
</thead>


                <tbody>
                  {filteredData.map((item,index) => (
                    
                    <tr
                      key={item._id}
                      onClick={() => setSelectedItem(item)}
                      className="cursor-pointer hover:bg-slate-700 border-b border-slate-700"
                    >
                        {/* Serial Number */}
      <td className="p-3 font-semibold text-slate-400">
        {index + 1}
      </td>
                     <td className="p-3">{item.email}</td>

{activeModule.key === "consultations" && (
  <>
    <td className="p-3">{item.name}</td>
    <td className="p-3 text-emerald-400">
      {item.ChooseOurService}
    </td>
  </>
)}

{activeModule.key === "Payment" && (
  <>
    <td className="p-3">{item.name}</td>
    <td className="p-3">{item.category}</td>
    <td className="p-3">{item.subCategory}</td>
   <td className="p-3">
  {/* Amount */}
  <div className="font-semibold text-emerald-400">
    ₹{item.amount}
  </div>

  {/* Payment Status */}
  <div
    className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold
      ${
        item.paymentStatus === "paid"
          ? "bg-green-100 text-green-700"
          : item.paymentStatus === "failed"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }
    `}
  >
    {item.paymentStatus === "paid"
      ? "Paid"
      : item.paymentStatus === "failed"
      ? "Failed"
      : "Created"}
  </div>
</td>

  </>
)}
{activeModule.key === "contact" && (
  <>
    <td className="p-3">{item.name}</td>

    <td className="p-3 text-slate-300">
      {item.message}
    </td>
  </>
)}

<td className="p-3">
   {formatDateTime(item.createdAt)}
</td>

                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredData.length === 0 && (
                <p className="p-4 text-center text-slate-400">
                  No records found
                </p>
              )}
            </div>
          ) : (
            <p className="text-slate-500 text-center mt-20">
             Welcome Admin! Select a module from sidebar
            </p>
          )}
        </main>
      </div>

      {/* ---------------- DETAILS MODAL ---------------- */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
       <div className="bg-slate-800 rounded-2xl w-full max-w-2xl relative flex flex-col max-h-[85vh]">

            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-slate-400"
            >
              <X />
            </button>
{/* HEADER */}
<div className="p-6 border-b border-slate-700 flex justify-between items-center">
  <h2 className="text-xl font-bold">Submission Details</h2>
</div>
{/* SCROLLABLE BODY */}
<div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* <div className=""> */}

  {Object.entries(selectedItem).map(([key, value], index) => {
    if (key === "_id" || key === "__v" || key === "updatedAt") return null;

    let displayValue = String(value);

    if (key === "createdAt") {
      displayValue = formatDateTime(value);
    }

    if (key === "razorpay" && typeof value === "object") {
      displayValue = "Payment Details"; // you can expand this later
    }

    return (
      <motion.p
        key={key}
 className="text-sm 
  bg-slate-900 
  border border-slate-700 
  rounded-xl 
  p-3 
  shadow-md
  flex flex-col gap-1
"

        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
        whileHover={{ scale: 1.05, backgroundColor: "#20a084" }}
      >
        <b>{key}:</b> {displayValue}
      </motion.p>
    );
  })}
</div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CodeItDashboard;
