import React from 'react';
import { ArrowLeft, Code, Layout } from 'lucide-react';

const CodeItDashboard = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-slate-900 font-sans text-white p-6">
            <div className="max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Code className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Code It Admin</h1>
                            <p className="text-slate-400 text-sm">Dashboard for Code It Platform</p>
                        </div>
                    </div>

                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Switch Website
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <div className="text-slate-400 text-sm font-medium mb-1">Total Users</div>
                        <div className="text-3xl font-bold">0</div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <div className="text-slate-400 text-sm font-medium mb-1">Active Projects</div>
                        <div className="text-3xl font-bold">0</div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <div className="text-slate-400 text-sm font-medium mb-1">Revenue</div>
                        <div className="text-3xl font-bold">₹0</div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-20 bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-700">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Layout className="text-slate-500 w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-300">Ready for Development</h2>
                    <p className="text-slate-500 mt-2 max-w-md text-center">
                        This is a separate dashboard environment for <strong>Code It</strong>.
                        Your colleague can start building features here without affecting the Peptides dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CodeItDashboard;
