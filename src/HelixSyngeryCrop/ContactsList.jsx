import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        "https://helixsynregycropbackend.onrender.com/api/contacts"
      );

      // Use the date/time from the API as-is
     const contactsWithDateTime = response.data.map((contact) => {
  const timestamp = contact.createdAt; // replace 'createdAt' with your actual timestamp field from API
  const dateObj = new Date(timestamp);
  return {
    ...contact,
    date: dateObj.toLocaleDateString(), // formats as 25/03/2026
    time: dateObj.toLocaleTimeString(), // formats as 16:45:12
  };
});

setContacts(contactsWithDateTime);
setFilteredContacts(contactsWithDateTime);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts based on search
  useEffect(() => {
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [search, contacts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-purple-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 drop-shadow-md">
        Helix Synergy Crop - Contact Form Details
      </h1>

      {/* Search + Refresh + Count */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
        />
        <button
          onClick={fetchContacts}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:scale-105 transition-all"
        >
          Refresh
        </button>
        <div className="text-gray-700 font-semibold bg-white px-4 py-2 rounded-xl shadow-sm">
          Total Contacts: {filteredContacts.length}
        </div>
      </div>

      {/* Dashboard Table */}
      <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <tr>
              {["#", "Name", "Email", "Message", "Date", "Time"].map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-sm font-semibold tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredContacts.map((contact, index) => (
              <motion.tr
                key={contact.id || index}
                whileHover={{
                  scale: 1.03,
                  backgroundColor: "rgba(147,197,253,0.2)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="cursor-pointer"
                onClick={() => setSelectedContact(contact)}
              >
                <td className="px-6 py-3 font-medium text-gray-800">{index + 1}</td>
                <td className="px-6 py-3 text-gray-800">{contact.name}</td>
                <td className="px-6 py-3 text-gray-700">{contact.email}</td>
                <td className="px-6 py-3 text-gray-600 truncate max-w-xs">
                  {contact.message}
                </td>
                <td className="px-6 py-3 text-gray-700">{contact.date}</td>
                <td className="px-6 py-3 text-gray-700">{contact.time}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {selectedContact && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
              onClick={() => setSelectedContact(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: -50 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-3xl w-96 z-50 p-6 ring-1 ring-gray-300"
            >
              <h2 className="text-2xl font-bold mb-4 text-gradient bg-clip-text text-blue-600">
                Contact Details
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">Name:</span> {selectedContact.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {selectedContact.email}
                </p>
                <p>
                  <span className="font-semibold">Message:</span> {selectedContact.message}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {selectedContact.date}
                </p>
                <p>
                  <span className="font-semibold">Time:</span> {selectedContact.time}
                </p>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:scale-105 transition-all shadow-lg"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactsList;