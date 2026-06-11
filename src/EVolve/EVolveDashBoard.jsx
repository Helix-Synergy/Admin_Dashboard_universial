import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Search,
  RefreshCcw,
  Upload,
  Trash2,
  FileText,
  X
} from "lucide-react";

const EVolveDashBoard = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("users"); // "users" | "magazines"
  
  // Users State
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Magazines State
  const [magazines, setMagazines] = useState([]);
  const [magLoading, setMagLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [magTitle, setMagTitle] = useState("");
  const [magFile, setMagFile] = useState(null);

  const API_BASE = import.meta.env.VITE_EVOLVE_API_BASE || "https://e-volve-backend.onrender.com";

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchMagazines();
    }
  }, [activeTab]);

  // --- Users Logic ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/auth/getalldetails`);
      const data = response.data;
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setUsers([]);
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter((user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  // --- Magazines Logic ---
  const fetchMagazines = async () => {
    try {
      setMagLoading(true);
      const response = await axios.get(`${API_BASE}/auth/magazines/EVolve`);
      setMagazines(response.data);
      setMagLoading(false);
    } catch (error) {
      console.error("Error fetching magazines:", error);
      setMagLoading(false);
    }
  };

  const handleUploadMagazine = async (e) => {
    e.preventDefault();
    if (!magFile || !magTitle) return alert("Please provide a title and a PDF file.");

    const formData = new FormData();
    formData.append("title", magTitle);
    formData.append("vertical", "EVolve");
    formData.append("pdfFile", magFile);

    try {
      setUploading(true);
      await axios.post(`${API_BASE}/auth/magazines/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Magazine uploaded successfully!");
      setMagTitle("");
      setMagFile(null);
      fetchMagazines();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload magazine.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMagazine = async (id) => {
    if (!window.confirm("Delete this magazine?")) return;
    try {
      await axios.delete(`${API_BASE}/auth/magazines/${id}`);
      fetchMagazines();
    } catch (error) {
      console.error("Error deleting magazine:", error);
      alert("Failed to delete.");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      
      {/* ---------------- LEFT SIDEBAR ---------------- */}
      <aside className="w-20 md:w-72 bg-slate-900 text-white flex flex-col transition-all duration-300 shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BookOpen className="text-white" size={20} />
            </div>
            <h1 className="hidden md:block text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              E-Volve
            </h1>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2 flex-grow">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "users"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20 translate-x-1"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Users size={20} />
            <span className="hidden md:block font-semibold">User Details</span>
          </button>

          <button
            onClick={() => setActiveTab("magazines")}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "magazines"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20 translate-x-1"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <FileText size={20} />
            <span className="hidden md:block font-semibold">Digital Magazines</span>
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <ArrowLeft size={20} />
              <span className="hidden md:block font-medium">Switch Website</span>
            </button>
          )}
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
        
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center z-10 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === "users" ? "User Details" : "Digital Magazines"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {activeTab === "users" ? "Manage and view all registered users." : "Upload and manage flipbook publications."}
            </p>
          </div>

          <div className="flex gap-4">
            {activeTab === "users" && (
              <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl border border-purple-100 font-semibold shadow-sm flex items-center gap-2">
                <Users size={18} />
                Total Users: {filteredUsers.length}
              </div>
            )}
            {activeTab === "magazines" && (
              <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl border border-purple-100 font-semibold shadow-sm flex items-center gap-2">
                <BookOpen size={18} />
                Total Magazines: {magazines.length}
              </div>
            )}
          </div>
        </header>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* ================= USERS TAB ================= */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-slideIn">
              
              {/* Search & Actions */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  onClick={fetchUsers}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-purple-600 transition-all shadow-sm font-medium"
                >
                  <RefreshCcw size={18} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Created At</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center py-12">
                          <div className="inline-flex items-center gap-2 text-slate-500">
                            <RefreshCcw className="animate-spin" size={20} /> Loading users...
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-12 text-slate-500">
                          No users found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-purple-50/50 transition-colors group">
                          <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                          <td className="px-6 py-4 text-slate-600">{user.email}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">
                            {new Date(user.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= MAGAZINES TAB ================= */}
          {activeTab === "magazines" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slideIn">
              
              {/* Upload Form */}
              <div className="col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Upload size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">New Magazine</h3>
                  </div>
                  
                  <form onSubmit={handleUploadMagazine} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Magazine Title</label>
                      <input
                        type="text"
                        required
                        value={magTitle}
                        onChange={(e) => setMagTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 focus:bg-white transition-all"
                        placeholder="e.g., June 2026 Edition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">PDF Document</label>
                      <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 transition-all text-center">
                        <input
                          type="file"
                          required
                          accept="application/pdf"
                          onChange={(e) => setMagFile(e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <BookOpen size={24} className="mb-2 text-slate-400" />
                          {magFile ? (
                            <span className="font-medium text-purple-600 truncate px-2 w-full">{magFile.name}</span>
                          ) : (
                            <span>Drag & drop or <span className="text-purple-600 font-semibold">Browse</span></span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {uploading ? (
                        <><RefreshCcw className="animate-spin" size={18} /> Uploading to Cloudinary...</>
                      ) : (
                        <><Upload size={18} /> Publish Magazine</>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* List of Magazines */}
              <div className="col-span-1 lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-purple-600" /> Published Editions
                  </h3>
                  <button onClick={fetchMagazines} className="text-slate-500 hover:text-purple-600 transition-colors p-2 rounded-lg hover:bg-purple-50">
                    <RefreshCcw size={18} className={magLoading ? "animate-spin" : ""} />
                  </button>
                </div>
                
                {magLoading ? (
                  <div className="text-center py-12 text-slate-500 flex flex-col items-center gap-3">
                    <RefreshCcw className="animate-spin text-purple-500" size={32} />
                    Loading your publications...
                  </div>
                ) : magazines.length === 0 ? (
                  <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-500 shadow-sm">
                    <BookOpen size={48} className="mb-4 text-slate-300" />
                    <p className="text-lg font-medium text-slate-700">No magazines published yet.</p>
                    <p className="text-sm">Use the form on the left to upload your first digital edition.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {magazines.map((mag) => (
                      <div key={mag._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-16 bg-gradient-to-tr from-purple-100 to-indigo-50 rounded-lg border border-purple-200 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="text-purple-500" size={24} />
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-slate-800 text-lg mb-1 truncate" title={mag.title}>{mag.title}</h4>
                            <p className="text-xs font-medium text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded-md mb-2">
                              {new Date(mag.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                          <a
                            href={mag.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors text-center"
                          >
                            Preview PDF
                          </a>
                          <button
                            onClick={() => handleDeleteMagazine(mag._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete Magazine"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative animate-slideIn">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">User Information</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Full Name</p>
                <p className="font-bold text-slate-800">{selectedUser.name}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Email Address</p>
                <p className="font-bold text-slate-800">{selectedUser.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Registered</p>
                  <p className="font-semibold text-slate-800 text-sm">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">User ID</p>
                  <p className="font-mono text-slate-800 text-xs truncate" title={selectedUser._id}>
                    ...{selectedUser._id.slice(-6)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EVolveDashBoard;