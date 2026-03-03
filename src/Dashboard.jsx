import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    MessageSquare,
    Mic,
    GraduationCap,
    Briefcase,
    Users,
    Handshake,
    Search,
    RefreshCw,
    MoreVertical,
    Calendar,
    Mail,
    Phone,
    FileText,
    MapPin,
    Building2,
    Filter,
    Plus,
    LinkIcon,
    ArrowUpRight,
    X,
    Eye,
    CreditCard,
    ArrowLeft,
    Trash2
} from 'lucide-react';
import RegistrationModal from './components/RegistrationModal';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Vibrant card with gradient background
const StatCard = ({ label, value, icon: Icon, colorTheme }) => (
    <div className={`relative overflow-hidden p-6 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] duration-300 bg-white border border-slate-100`}>
        <div className={`absolute top-0 right-0 p-4 opacity-10 ${colorTheme.text}`}>
            <Icon size={100} />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorTheme.bgLight} ${colorTheme.text}`}>
                <Icon size={24} />
            </div>
            <div>
                <div className="text-4xl font-extrabold text-slate-800 tracking-tight">{value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">{label}</div>
            </div>
        </div>
    </div>
);

// Updated DetailsModal to show more payment info
const DetailsModal = ({ item, onClose, theme, apiBaseUrl }) => {
    if (!item) return null;

    // Filter out internal MongoDB keys
    const entries = Object.entries(item).filter(([key]) => !['_id', '__v', 'updatedAt'].includes(key));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-scale-up">
                <div className={`px-8 py-6 bg-gradient-to-r ${theme.gradient} flex items-center justify-between shrink-0`}>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText size={20} className="opacity-80" /> Submission Details
                    </h3>
                    <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {entries.map(([key, value]) => (
                            <div key={key} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <div className="text-slate-800 font-medium break-words">
                                    {/* Handle Dates specifically */}
                                    {key.toLowerCase().includes('date') || key === 'createdAt' ? (
                                        new Date(value).toLocaleString()
                                    ) : key === 'videoPath' ? (
                                        value ? (
                                            <div className="mt-2 text-sm">
                                                <video controls className="w-full max-w-sm rounded-lg border border-slate-200 bg-black">
                                                    <source src={`${apiBaseUrl.replace('/api', '')}/${value.replace(/\\/g, '/')}`} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                                <div className="mt-1">
                                                    <a
                                                        href={`${apiBaseUrl.replace('/api', '')}/${value.replace(/\\/g, '/')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline flex items-center gap-1"
                                                    >
                                                        <LinkIcon size={12} /> Open in new tab
                                                    </a>
                                                </div>
                                            </div>
                                        ) : <span className="text-slate-400 italic">No video</span>
                                    ) : key === 'paymentScreenshot' || key === 'profileImage' || key === 'thumbnailUrl' ? (
                                        value ? (
                                            <div className="mt-2">
                                                <a
                                                    href={`${apiBaseUrl.replace('/api', '')}/${value.replace(/\\/g, '/')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block relative group overflow-hidden rounded-lg border border-slate-200 hover:border-blue-500 transition-colors"
                                                >
                                                    <img
                                                        src={`${apiBaseUrl.replace('/api', '')}/${value.replace(/\\/g, '/')}`}
                                                        alt="Payment/Profile"
                                                        className="w-32 h-32 object-cover transition-transform group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Eye className="text-white w-6 h-6" />
                                                    </div>
                                                </a>
                                                <div className="text-xs text-slate-400 mt-1">Click to view full size</div>
                                            </div>
                                        ) : <span className="text-slate-400 italic">No file</span>
                                    ) : (
                                        value ? value.toString() : <span className="text-slate-400 italic">N/A</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard({ selectedWebsite, onBack, apiBaseUrl }) {
    const [activeTab, setActiveTab] = useState('contact');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [syncing, setSyncing] = useState(false);

    // Use passed prop or fallback (though prop should always be passed now)
    const API_URL = apiBaseUrl || API_BASE;

    const themes = {
        blue: { bg: 'bg-blue-600', bgLight: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-cyan-500' },
        emerald: { bg: 'bg-emerald-600', bgLight: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', gradient: 'from-emerald-500 to-teal-500' },
        violet: { bg: 'bg-violet-600', bgLight: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', gradient: 'from-violet-500 to-purple-500' },
        amber: { bg: 'bg-amber-600', bgLight: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', gradient: 'from-amber-500 to-orange-500' },
        rose: { bg: 'bg-rose-600', bgLight: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', gradient: 'from-rose-500 to-pink-500' },
    };

    let tabs = [
        { id: 'contact', label: 'Messages', icon: MessageSquare, endpoint: '/contact', theme: themes.blue },
        { id: 'register-student', label: 'Students', icon: GraduationCap, endpoint: '/register-student', theme: themes.emerald },
        { id: 'register-faculty', label: 'Faculty', icon: Briefcase, endpoint: '/register-faculty', theme: themes.violet },
        { id: 'become-member', label: 'Members', icon: Users, endpoint: '/become-member', theme: themes.amber },
        { id: 'collaborate', label: 'Collab', icon: Handshake, endpoint: '/collaborate', theme: themes.rose },
        { id: 'payments', label: 'Payments', icon: CreditCard, endpoint: '/payment/all', theme: themes.emerald },
    ];

    // Filter tabs for Digigrow
    if (selectedWebsite === 'Digigrow') {
        tabs = [
            { id: 'contact', label: 'Messages', icon: MessageSquare, endpoint: '/contact', theme: themes.blue },
            { id: 'collaborate', label: 'Collab', icon: Handshake, endpoint: '/collaborate', theme: themes.rose },
        ];
    }

    // Filter tabs for Channel8
    if (selectedWebsite === 'Channel8') {
        tabs = [
            { id: 'contact', label: 'Messages', icon: MessageSquare, endpoint: '/contact', theme: themes.blue },
            { id: 'videos', label: 'Videos', icon: Eye, endpoint: '/videos', theme: themes.rose },
            { id: 'podcasts', label: 'Podcasts', icon: Mic, endpoint: '/podcasts', theme: themes.violet },
        ];
    }

    const currentTheme = tabs.find(t => t.id === activeTab)?.theme || themes.blue;

    const fetchData = async () => {
        setLoading(true);
        try {
            const endpoint = tabs.find(t => t.id === activeTab).endpoint;
            // Append source filter (though Digigrow backend might ignore it, keeping it safe)
            const res = await fetch(`${API_URL}${endpoint}?source=${selectedWebsite}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json();
            // Handle different response structures (Array vs { success, payments })
            const resultData = Array.isArray(json) ? json : (json.payments || json.data || []);
            setData(resultData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        }
        setLoading(false);
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            // Logic to sync specific item or all
            // For now, let's just trigger a bulk notification or just refresh
            // Ideally we iterate over visible 'PendingLink' items

            // Simulating a bulk sync request or just reloading which calls backend sync logic if implemented generally
            // But let's act on specific items that need it.
            const pendingItems = data.filter(item => item.payment_status === 'PendingLink' && item.razorpay_order_id);

            let updated = 0;
            for (const item of pendingItems) {
                const res = await fetch(`${API_BASE}/payment/sync-payment-status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentLinkId: item.razorpay_order_id,
                        type: item.type ? item.type.toLowerCase() : 'student' // ensure type param
                    })
                });
                const result = await res.json();
                if (result.status === 'paid') updated++;
            }

            if (updated > 0) {
                alert(`Synced! ${updated} payments updated to Paid.`);
                fetchData(); // Refresh table
            } else {
                alert('Sync complete. No status changes detected.');
            }

        } catch (error) {
            console.error(error);
            alert('Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, selectedWebsite]); // Add selectedWebsite dependency

    useEffect(() => {
        // Reset selection when switching tabs
        setSelectedItem(null);
    }, [activeTab]);

    const filteredData = data.filter(item => {
        const searchString = searchTerm.toLowerCase();
        const name = (item.firstName ? `${item.firstName} ${item.lastName || ''}` : item.name || item.title || '').toLowerCase(); // Added item.title for podcasts
        const email = (item.email || '').toLowerCase();
        return name.includes(searchString) || email.includes(searchString);
    });

    // Podcast Modal Component
    const PodcastModal = ({ isOpen, onClose, apiBaseUrl, onSuccess }) => {
        const [formData, setFormData] = useState({
            title: '',
            description: '',
            duration: '',
            date: '',
            audioUrl: ''
        });
        const [thumbnail, setThumbnail] = useState(null);
        const [isSubmitting, setIsSubmitting] = useState(false);

        if (!isOpen) return null;

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleFileChange = (e) => {
            if (e.target.files && e.target.files[0]) {
                setThumbnail(e.target.files[0]);
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (thumbnail) data.append('thumbnail', thumbnail);

            try {
                const response = await fetch(`${apiBaseUrl}/podcasts`, {
                    method: 'POST',
                    body: data
                });
                if (response.ok) {
                    onSuccess();
                    onClose();
                } else {
                    alert('Failed to create podcast');
                }
            } catch (error) {
                console.error(error);
                alert('Error creating podcast');
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-scale-up">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">New Podcast Episode</h3>
                        <button onClick={onClose}><X size={24} className="text-slate-400 hover:text-slate-600" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Episode Title" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" rows="3" placeholder="Brief description..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                                <input name="duration" value={formData.duration} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. 45:10" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date Display</label>
                                <input name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. Oct 22" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Video/Audio URL</label>
                            <input name="audioUrl" value={formData.audioUrl} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail</label>
                            <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50">
                            {isSubmitting ? 'Creating...' : 'Create Episode'}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this podcast?')) {
            try {
                const response = await fetch(`${API_URL}/podcasts/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setData(data.filter(item => item._id !== id));
                    // Optional: Show success toast
                } else {
                    alert('Failed to delete podcast');
                }
            } catch (error) {
                console.error('Error deleting podcast:', error);
                alert('Error deleting podcast');
            }
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {activeTab !== 'podcasts' && (
                <RegistrationModal
                    isOpen={isModalOpen}
                    selectedWebsite={selectedWebsite}
                    onClose={() => { setIsModalOpen(false); fetchData(); }}
                />
            )}
            {activeTab === 'podcasts' && <PodcastModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} apiBaseUrl={API_URL} onSuccess={fetchData} />}

            {/* CSS Animation for Table Rows & Modal */}
            <style>{`
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-slide-in {
                animation: slideIn 0.3s ease-out forwards;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            .animate-fade-in { animation: fadeIn 0.2s ease-out; }
            .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        `}</style>

            {/* Detail Modal */}
            {selectedItem && (
                <DetailsModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    theme={currentTheme}
                    apiBaseUrl={API_URL}
                />
            )}

            {/* Sidebar */}
            <aside className="w-72 bg-[#0F172A] text-white flex flex-col shadow-2xl relative z-30">
                <div className="p-8 pb-4">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm font-medium transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Switch Website
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <LayoutDashboard className="text-white" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-tight leading-tight">Admin<span className="text-blue-400">Panel</span></span>
                            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{selectedWebsite}</span>
                        </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Main Menu</div>
                </div>

                <div className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive
                                    ? `bg-gradient-to-r ${tab.theme.gradient} text-white shadow-lg`
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'} />
                                <span className="font-medium relative z-10">{tab.label}</span>
                                {isActive && <div className="absolute inset-0 bg-white/20 blur-xl opacity-50"></div>}
                            </button>
                        );
                    })}
                </div>

                <div className="p-6 border-t border-slate-800/50 bg-[#0B1120]">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold border-2 border-slate-700">
                            PK
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-medium text-sm truncate">Admin User</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background blobs for vibrancy */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/80 to-transparent -z-10 pointer-events-none"></div>
                <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-10 bg-gradient-to-br ${currentTheme.gradient} blur-3xl -z-10 transition-colors duration-700`}></div>

                {/* Header */}
                <header className="px-8 py-6 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            {tabs.find(t => t.id === activeTab)?.label}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentTheme.bgLight} ${currentTheme.text} border ${currentTheme.border}`}>
                                Overview
                            </span>
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Manage and view your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} entries.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* New Registration/Podcast Button */}
                        {(selectedWebsite !== 'Channel8' || activeTab === 'podcasts') && selectedWebsite !== 'Digigrow' && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className={`flex items-center gap-2 px-4 py-2.5 text-white rounded-xl shadow-lg transition-all active:scale-95 font-medium ${activeTab === 'podcasts' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
                            >
                                <Plus size={18} />
                                <span>{activeTab === 'podcasts' ? 'New Episode' : 'New Registration'}</span>
                            </button>
                        )}

                        {/* Sync Button (visible only for payments tab) */}
                        {activeTab === 'payments' && (
                            <button
                                onClick={handleSync}
                                disabled={syncing}
                                className={`flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all font-medium ${syncing ? 'opacity-70' : ''}`}
                            >
                                <RefreshCw size={18} className={syncing ? 'animate-spin text-blue-500' : 'text-slate-400'} />
                                <span>{syncing ? 'Syncing...' : 'Sync Status'}</span>
                            </button>
                        )}

                        <div className="relative group shadow-sm hover:shadow-md transition-shadow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all w-72 text-sm"
                            />
                        </div>
                        <button
                            onClick={fetchData}
                            className="p-2.5 text-slate-600 bg-white hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-200 shadow-sm hover:shadow active:scale-95"
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin text-blue-500' : ''} />
                        </button>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="p-8 pt-0 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            label="Total Records"
                            value={data.length}
                            icon={tabs.find(t => t.id === activeTab)?.icon}
                            colorTheme={currentTheme}
                        />

                        {/* Revenue Card - Only visible on Payments Tab */}
                        {activeTab === 'payments' && (
                            <StatCard
                                label="Total Revenue"
                                value={`₹${data.reduce((sum, item) => sum + (item.payment_status === 'Paid' ? (Number(item.amount) || 0) : 0), 0).toLocaleString('en-IN')}`}
                                icon={CreditCard}
                                colorTheme={themes.emerald}
                            />
                        )}

                        {/* Placeholder for future stats - makes UI look complete */}
                        {activeTab !== 'payments' && (
                            <div className="bg-white/60 p-6 rounded-2xl border border-slate-200/60 flex items-center justify-center text-slate-400 italic text-sm border-dashed">
                                Detailed Analytics coming soon...
                            </div>
                        )}
                    </div>

                    {/* Data Table Container */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                                        <th className="px-6 py-5 font-semibold w-16">#</th>
                                        <th className="px-6 py-5 font-semibold">User Profile</th>
                                        <th className="px-6 py-5 font-semibold">Summary</th>
                                        <th className="px-6 py-5 font-semibold">Date</th>
                                        <th className="px-6 py-5 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading && data.length === 0 ? (
                                        <tr><td colSpan="5" className="p-10 text-center text-slate-400">Loading...</td></tr>
                                    ) : filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-16 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                        <Search className="text-slate-300 w-10 h-10" />
                                                    </div>
                                                    <h3 className="text-xl font-medium text-slate-700">No results found</h3>
                                                    <p className="text-slate-500">Try adjusting your filters.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item, index) => (
                                            <tr
                                                key={item._id}
                                                className="hover:bg-slate-50/80 transition-all duration-200 group animate-slide-in cursor-pointer"
                                                style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                                                onClick={() => setSelectedItem(item)}
                                            >
                                                <td className="px-6 py-5 text-slate-400 font-mono text-sm">{index + 1}</td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md bg-gradient-to-br ${currentTheme.gradient}`}>
                                                            {(item.firstName || item.name || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-800 text-base">
                                                                {item.firstName ? `${item.firstName} ${item.lastName || ''}` : item.name || item.title}
                                                            </div>
                                                            <div className="text-sm text-slate-500 flex flex-col gap-1 mt-1">
                                                                <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-400" /> {item.email}</span>
                                                                {item.phone && (
                                                                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                                                                        <Phone size={14} className="text-slate-400" /> {item.phone}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="max-w-xs">
                                                        {/* Custom View for Payments */}
                                                        {activeTab === 'payments' ? (
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-bold text-slate-700">₹{item.amount ? item.amount : '0'}</span>
                                                                <span className={`text-xs font-bold px-2 py-0.5 rounded w-fit ${item.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : item.payment_status === 'PendingLink' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                    {item.payment_status}
                                                                </span>
                                                                {/* Show Link ID for PendingLink */}
                                                                {item.payment_status === 'PendingLink' && item.razorpay_order_id && (
                                                                    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono bg-slate-100 px-1 rounded border border-slate-200">
                                                                        <LinkIcon size={10} /> {item.razorpay_order_id.substring(0, 10)}...
                                                                    </span>
                                                                )}
                                                                {item.payment_status === 'Paid' && item.razorpay_payment_id && (
                                                                    <span className="text-[10px] text-slate-400 font-mono">Ref: {item.razorpay_payment_id}</span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {/* Default View */}
                                                                {item.university && (
                                                                    <div className="flex items-center gap-2 text-sm text-slate-600 break-words">
                                                                        <Building2 size={14} className="text-slate-400 shrink-0" /> {item.university}
                                                                    </div>
                                                                )}
                                                                {!item.university && (item.message || item.description) && (
                                                                    <p className="text-sm text-slate-500 line-clamp-2 italic">"{item.message || item.description}"</p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                        <Calendar size={14} className="text-slate-400" />
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTheme.bgLight} ${currentTheme.text} hover:shadow-md border ${currentTheme.border} whitespace-nowrap`}
                                                        >
                                                            View Details
                                                        </button>
                                                        {activeTab === 'podcasts' && (
                                                            <button
                                                                onClick={(e) => handleDelete(item._id, e)}
                                                                className="px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 transition-all shadow-sm"
                                                                title="Delete Podcast"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
