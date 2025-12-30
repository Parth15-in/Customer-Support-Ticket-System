import { useEffect } from 'react';
import { X, Calendar, User, Clock, AlertCircle } from 'lucide-react';

interface TicketDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: any;
}

export default function TicketDetailsModal({ isOpen, onClose, ticket }: TicketDetailsModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !ticket) return null;

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'MEDIUM': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'LOW': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="glass w-full max-w-2xl p-8 rounded-3xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto overscroll-contain">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-slate-500 hover:text-white hover:rotate-90 transition-all z-10"
                >
                    <X size={24} />
                </button>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className={`badge ${getStatusStyles(ticket.status)}`}>
                            {ticket.status}
                        </span>
                        <span className={`badge ${getPriorityStyles(ticket.priority)}`}>
                            {ticket.priority} Priority
                        </span>
                    </div>

                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                            {ticket.title}
                        </h2>
                        <div className="flex items-center gap-4 mt-3 text-slate-400 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                {new Date(ticket.createdAt).toLocaleString(undefined, {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                })}
                            </div>
                            <div className="flex items-center gap-2">
                                <User size={14} />
                                {ticket.customer?.name || ticket.customer?.email}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3 block">Description</label>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {ticket.description}
                        </p>
                    </div>

                    {ticket.agentId && (
                        <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Assigned Agent</p>
                                <p className="text-white font-medium">{ticket.agent?.name || 'Support Agent'} <span className="text-slate-500 text-xs font-normal">({ticket.agentId.substring(0, 8)})</span></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
