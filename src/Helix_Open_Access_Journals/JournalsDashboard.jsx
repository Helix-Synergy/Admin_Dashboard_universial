import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, RefreshCcw, Mail, User, MessageSquare, Calendar, X } from "lucide-react";

const JournalsDashboard = ({ onBack }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchSubmissions = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await axios.get(import.meta.env.VITE_Helix_Journals_API_BASE);

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.forms)
        ? res.data.forms
        : [];

      setSubmissions(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load submissions");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Helix Open Access Journals – Admin Dashboard
          </h1>
        </div>

        <button
          onClick={fetchSubmissions}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
          disabled={loading}
        >
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Count */}
      {!loading && !error && (
        <div className="mb-6 text-slate-300">
          Total Submissions:{" "}
          <span className="font-bold text-indigo-400">
            {submissions.length}
          </span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center text-slate-400 mt-20 animate-pulse">
          Loading submissions...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center text-red-400 mt-20">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="px-6 py-4">Sl. No</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((item, index) => (
                  <tr
                    key={item._id || index}
                    onClick={() => setSelectedItem(item)}
                    className="border-t border-white/5 hover:bg-slate-700/30 transition cursor-pointer"
                  >
                    <td className="px-6 py-4 font-bold text-indigo-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4 text-blue-400">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 max-w-md truncate">
                      {item.message}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}

{selectedItem && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
      <button
        onClick={() => setSelectedItem(null)}
        className="absolute top-4 right-4 text-slate-400 hover:text-white"
      >
        <X />
      </button>

      <h2 className="text-2xl font-bold mb-6 text-indigo-400">
        Submission Details
      </h2>

      <div className="space-y-4 text-slate-300">
        {/* Name */}
        <div className="flex gap-2">
          <span className="font-semibold text-slate-400 w-24">Name:</span>
          <span>{selectedItem.name || "—"}</span>
        </div>

        {/* Email */}
        <div className="flex gap-2">
          <span className="font-semibold text-slate-400 w-24">Email:</span>
          <span className="text-blue-400">
            {selectedItem.email || "—"}
          </span>
        </div>

        {/* Message */}
        <div className="flex gap-2">
          <span className="font-semibold text-slate-400 w-24">Message:</span>
          <p className="whitespace-pre-wrap break-words">
            {selectedItem.message || "—"}
          </p>
        </div>

        {/* Date */}
        <div className="flex gap-2">
          <span className="font-semibold text-slate-400 w-24">Date:</span>
          <span className="text-slate-400">
            {selectedItem.createdAt
              ? new Date(selectedItem.createdAt).toLocaleString()
              : "—"}
          </span>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default JournalsDashboard;
