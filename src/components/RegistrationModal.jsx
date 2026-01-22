import React, { useState } from 'react';
import Modal from 'react-modal';
import { X, Copy, Check } from 'lucide-react';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '90%',
        width: '800px',
        maxHeight: '90vh',
        padding: '0',
        borderRadius: '1.5rem',
        border: 'none',
        backgroundColor: '#fff',
    },
    overlay: {
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
    }
};

Modal.setAppElement('#root'); // Ensure accessibility

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const Required = () => <span className="text-red-500 ml-1">*</span>;

export default function RegistrationModal({ isOpen, onClose, selectedWebsite }) {
    const [tab, setTab] = useState('student'); // 'student' or 'faculty'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedLink, setGeneratedLink] = useState(null);
    const [copied, setCopied] = useState(false);

    const resetForm = () => {
        setGeneratedLink(null);
        setIsSubmitting(false);
        setCopied(false);
    };

    const handleTabChange = (newTab) => {
        setTab(newTab);
        resetForm();
    };

    const copyToClipboard = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Extract amount separate from formData for API structure
        const amount = data.amount;
        // delete amount from data to keep it clean if desired, but keeping it is fine too

        try {
            const response = await fetch(`${API_BASE}/payment/create-payment-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: tab,
                    formData: data,
                    amount: amount,
                    source: selectedWebsite || 'Peptides'
                }),
            });

            const result = await response.json();
            if (result.success) {
                setGeneratedLink(result.short_url);
            } else {
                alert(result.message || 'Failed to generate link');
            }
        } catch (error) {
            console.error(error);
            alert('Error connecting to server');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Registration Modal"
        >
            <div className="flex flex-col h-full max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800">New Registration & Payment Link</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button
                        className={`flex-1 py-4 font-semibold text-sm transition-colors ${tab === 'student' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                        onClick={() => handleTabChange('student')}
                    >
                        Student
                    </button>
                    <button
                        className={`flex-1 py-4 font-semibold text-sm transition-colors ${tab === 'faculty' ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                        onClick={() => handleTabChange('faculty')}
                    >
                        Faculty
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {generatedLink ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Check size={32} className="text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Payment Link Generated!</h3>
                            <p className="text-slate-500 text-center max-w-md">
                                The registration record has been created. Share this link with the user to complete the payment.
                            </p>

                            <div className="flex items-center gap-2 w-full max-w-md bg-slate-100 p-3 rounded-xl border border-slate-200">
                                <input
                                    type="text"
                                    readOnly
                                    value={generatedLink}
                                    className="flex-1 bg-transparent border-none outline-none text-slate-700 font-mono text-sm"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-slate-600 shadow-sm hover:shadow'}`}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>

                            <button
                                onClick={resetForm}
                                className="text-blue-600 hover:underline text-sm font-medium"
                            >
                                Create Another Registration
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Common Fields */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name <Required /></label>
                                <input name="firstName" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name <Required /></label>
                                <input name="lastName" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email <Required /></label>
                                <input name="email" type="email" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile <Required /></label>
                                <input name="mobile" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender <Required /></label>
                                <select name="gender" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">Select</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payment Amount (INR) <Required /></label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                                    <input name="amount" type="number" required defaultValue="1000" min="1" className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700" />
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                                <h4 className="text-sm font-bold text-slate-700 mb-3">Location Details</h4>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address <Required /></label>
                                <input name="address" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">State <Required /></label>
                                <input name="state" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Country <Required /></label>
                                <input name="country" defaultValue="India" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            {/* Specific Fields */}
                            <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                                <h4 className="text-sm font-bold text-slate-700 mb-3">{tab === 'student' ? 'Academic Details' : 'Professional Details'}</h4>
                            </div>

                            {tab === 'student' ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">College <Required /></label>
                                        <input name="college" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course <Required /></label>
                                        <input name="course" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Area of Interest <Required /></label>
                                        <input name="areaOfInterest" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">College/University <Required /></label>
                                        <input name="college" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department <Required /></label>
                                        <input name="department" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designation <Required /></label>
                                        <input name="designation" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Services <Required /></label>
                                <select name="services" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">Select</option>
                                    <option>ACADEMIC PROJECT</option>
                                    <option>INTERNSHIP</option>
                                    <option>WORKSHOP</option>
                                    <option>CONTRACT RESEARCH</option>
                                    <option>INDUSTRIAL VISIT</option>
                                    <option>SEMINAR & CONFERENCE</option>
                                    <option>THESIS SUPPORT</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">How you know us <Required /></label>
                                <select name="howYouKnowAboutUs" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option>Social Media</option>
                                    <option>Friend/Colleague</option>
                                    <option>Online Search</option>
                                    <option>Advertisement</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Comment</label>
                                <textarea name="comment" rows="2" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`md:col-span-2 py-4 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-[0.98] ${tab === 'student' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30' : 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-500/30'}`}
                            >
                                {isSubmitting ? 'Generating Link...' : 'Create & Generate Payment Link'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </Modal>
    );
}
