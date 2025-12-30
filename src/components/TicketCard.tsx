'use client';

import { Calendar, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface TicketCardProps {
    ticket: any;
    onUpdate?: () => void;
    isAgent?: boolean;
    onClick?: () => void;
}

export default function TicketCard({ ticket, onUpdate, isAgent, onClick }: TicketCardProps) {
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
            case 'HIGH': return 'text-rose-500';
            case 'MEDIUM': return 'text-amber-500';
            case 'LOW': return 'text-emerald-500';
            default: return 'text-slate-500';
        }
    };

    const updateStatus = async (newStatus: string) => {
        try {
            const res = await fetch(`/api/tickets/${ticket.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) onUpdate?.();
        } catch (err) {
            console.error(err);
        }
    };

    const assignToMe = async () => {
        try {
            const res = await fetch(`/api/tickets/${ticket.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignToMe: true }),
            });
            if (res.ok) onUpdate?.();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            onClick={onClick}
            className="glass p-6 rounded-2xl flex flex-col group relative overflow-hidden cursor-pointer hover:bg-white/5 transition-all"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white truncate group-hover:text-blue-400 transition-colors uppercase tracking-tight">{ticket.title}</h3>
                    <p className="text-slate-400 mt-2 line-clamp-2 text-sm leading-relaxed">{ticket.description}</p>
                </div>
                <span className={`badge ${getStatusStyles(ticket.status)} ml-4`}>
                    {ticket.status}
                </span>
            </div>

            <div className="mt-auto pt-6 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs font-medium text-slate-500 border-t border-slate-800/50">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                {isAgent && (
                    <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        <span className="truncate max-w-[120px]">{ticket.customer?.name || ticket.customer?.email?.split('@')[0]}</span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <AlertCircle size={14} className={getPriorityStyles(ticket.priority)} />
                    <span className={getPriorityStyles(ticket.priority)}>{ticket.priority}</span>
                </div>
            </div>

            {isAgent && (
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800/50">
                    {!ticket.agentId ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                assignToMe();
                            }}
                            className="btn-primary py-1.5 px-4 text-xs flex-1"
                        >
                            Claim Ticket
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex-1">
                            <CheckCircle2 size={12} /> Assigned to you
                        </div>
                    )}

                    {ticket.status !== 'RESOLVED' && ticket.agentId && (
                        <div className="flex gap-2">
                            {ticket.status === 'OPEN' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus('IN_PROGRESS');
                                    }}
                                    className="btn-secondary py-1.5 px-3 text-xs"
                                >
                                    Start
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateStatus('RESOLVED');
                                }}
                                className="btn-primary py-1.5 px-4 text-xs bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
                            >
                                Resolve
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
