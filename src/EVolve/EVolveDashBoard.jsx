import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const EVolveDashBoard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_EVOLVE_API_BASE;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // const response = await axios.get(`${API_BASE}/getalldetails`);
       const response = await axios.get("https://e-volve-backend.onrender.com/auth/getalldetails");
console.log("API_BASE:", API_BASE);
console.log("ENV:", import.meta.env);
console.log("API_BASE:", import.meta.env.VITE_EVOLVE_API_BASE);
      const data = response.data;

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Invalid API response:", data);
        setUsers([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setUsers([]);
      setLoading(false);
    }
  };

  // ✅ Derive filtered users safely
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    return users.filter((user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">
          E-Volve Dashboard
        </h2>

        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={fetchUsers}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-4 text-gray-700 font-semibold">
        Total Users: {filteredUsers.length}
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full text-left">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Created At</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-6">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">User Details</h3>

            <p><strong>ID:</strong> {selectedUser._id}</p>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
            <p><strong>Updated:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</p>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EVolveDashBoard;