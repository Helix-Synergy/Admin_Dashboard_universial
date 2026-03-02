import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, ArrowLeft, RefreshCw, Search } from "lucide-react";

const API_BASE = import.meta.env.VITE_Aura_API_BASE;

const AuraDashboard = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH FORMS =================
  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/form/getform`);
const data = Array.isArray(res.data.data) ? res.data.data : [];
setForms(data.reverse());
    } catch (err) {
      console.error("Error fetching forms", err);
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // ================= SEARCH FILTER =================
  const filteredForms = forms.filter((form) =>
    `${form.name} ${form.email} ${form.companyname} ${form.serviceofinterest}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-slate-900 text-white">

      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-10"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="space-y-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <FileText size={18} />
            <span className="font-semibold">Form Consultation</span>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Aura Consultation Forms</h1>

          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            {/* REFRESH */}
            <button
              onClick={fetchForms}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 h-[80vh]">

          {/* ================= TABLE ================= */}
          <div className="col-span-2 bg-slate-800/40 rounded-2xl border border-slate-700 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full text-slate-400">
                Loading forms...
              </div>
            ) : (
              <table className="w-full text-sm">
         <thead className="bg-slate-900">
  <tr className="text-left text-slate-400">
    <th className="p-4 border-r border-slate-700">S.No</th>
    <th className="p-4 border-r border-slate-700">Name</th>
    <th className="p-4 border-r border-slate-700">Email</th>
    <th className="p-4 border-r border-slate-700">Company</th>
    <th className="p-4">Service</th>
  </tr>
</thead>

                <tbody>
                  {filteredForms.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-slate-400">
                        No matching forms found
                      </td>
                    </tr>
                  ) : (
                    filteredForms.map((form,index) => (
                 <tr
  key={form._id}
  onClick={() => setSelectedForm(form)}
  className="border-t border-slate-700 hover:bg-slate-700/40 cursor-pointer transition"
>
  <td className="p-4 text-slate-400 border-r border-slate-700">
    {index + 1}
  </td>

  <td className="p-4 font-medium border-r border-slate-700">
    {form.name}
  </td>

  <td className="border-r border-slate-700">
    {form.email}
  </td>

  <td className="border-r border-slate-700">
    {form.companyname}
  </td>

  <td className="text-red-400">
    {form.serviceofinterest}
  </td>
</tr>

                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* ================= DETAILS PANEL ================= */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700 p-6 overflow-hidden">
            {!selectedForm ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                Select a form to view details
              </div>
            ) : (
              <div className="animate-slideIn">
                <h2 className="text-xl font-bold mb-4 text-red-400">
                  Form Details
                </h2>

                <div className="space-y-3 text-sm">
                  <p><strong>Name:</strong> {selectedForm.name}</p>
                  <p><strong>Email:</strong> {selectedForm.email}</p>
                  <p><strong>Phone:</strong> {selectedForm.phone}</p>
                  <p><strong>Company:</strong> {selectedForm.companyname}</p>
                  <p><strong>Industry:</strong> {selectedForm.industry}</p>
                  <p><strong>Service:</strong> {selectedForm.serviceofinterest}</p>

                  <div>
                    <p className="font-semibold mb-1">Message</p>
                    <p className="text-slate-300 bg-slate-900 p-3 rounded-lg">
                      {selectedForm.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default AuraDashboard;
