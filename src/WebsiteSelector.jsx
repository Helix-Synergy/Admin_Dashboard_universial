import React from 'react';
import { Globe, ArrowRight, Layout, PlusCircle } from 'lucide-react';

const WebsiteSelector = ({ onSelect }) => {
    const websites = [
        {
            id: 'Peptides',
            name: 'Peptides Knowledge Park',
            url: 'peptides.org',
            color: 'from-blue-500 to-indigo-600',
            active: true,
            description: 'Main peptides research and collaboration platform.'
        },
        {
            id: 'CodeIt',
            name: 'Code It',
            url: 'codeit.com', // Placeholder URL
            color: 'from-emerald-500 to-teal-600',
            active: true,
            description: 'Coding education and project platform.'
        }
    ];

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-8 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[#0F172A]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>

            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]"></div>

            <div className="relative z-10 w-full max-w-5xl">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30 mb-4 animate-bounce-slow">
                        <Layout className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                        Select Dashboard
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Welcome back, Admin. Choose a website to manage its submissions and data.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {websites.map((site) => (
                        <button
                            key={site.id}
                            onClick={() => site.active && onSelect(site.id)}
                            disabled={!site.active}
                            className={`group relative overflow-hidden rounded-3xl text-left transition-all duration-300 ${site.active
                                ? 'hover:scale-[1.02] cursor-pointer'
                                : 'opacity-60 cursor-not-allowed grayscale'
                                }`}
                        >
                            {/* Card Border & Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl group-hover:border-slate-600 transition-colors"></div>

                            {/* Hover Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${site.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                            <div className="relative p-8 h-full flex flex-col">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${site.color} flex items-center justify-center shadow-lg`}>
                                        <Globe className="text-white w-6 h-6" />
                                    </div>
                                    {site.active && <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">Active</div>}
                                    {!site.active && <div className="px-3 py-1 rounded-full bg-slate-700 border border-slate-600 text-slate-400 text-xs font-bold uppercase tracking-wider">Inactive</div>}
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{site.name}</h3>
                                <p className="text-slate-400 text-sm mb-8 flex-grow">{site.description}</p>

                                <div className={`flex items-center gap-2 text-sm font-semibold transition-all ${site.active ? 'text-white' : 'text-slate-500'}`}>
                                    {site.active ? 'Open Dashboard' : 'Coming Soon'}
                                    {site.active && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </div>
                            </div>
                        </button>
                    ))}

                    {/* Add New Site Card */}
                    <button className="group relative rounded-3xl border-2 border-dashed border-slate-800 hover:border-slate-700 bg-transparent hover:bg-slate-800/50 transition-all duration-300 flex flex-col items-center justify-center p-8 min-h-[300px] text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center mb-4 transition-colors">
                            <PlusCircle className="text-slate-500 group-hover:text-white transition-colors" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400 group-hover:text-white transition-colors">Add New Website</h3>
                        <p className="text-slate-500 text-sm mt-2 max-w-[200px]">Connect another production website to this control panel.</p>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default WebsiteSelector;
