'use client';

import { useAuth } from "@/context/AuthContext";
import { LogOut, Ticket } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-800/100 bg-slate-950/80 backdrop-blur-md mb-8">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                        <Ticket className="text-white" size={24} />
                    </div>
                    <div>
                        <span className="text-xl font-black text-white tracking-tighter">TICKETFLOW</span>
                        <div className="h-1 w-full bg-blue-600 rounded-full mt-[-2px]"></div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-sm font-bold text-white">{user?.name || user?.email?.split('@')[0]}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{user?.role}</span>
                    </div>

                    <button
                        onClick={logout}
                        className="btn-ghost px-3 py-2 flex items-center gap-2 text-slate-400 hover:text-white transition-all"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-semibold">Sign Out</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
