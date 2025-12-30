'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import TicketCard from '@/components/TicketCard';
import CreateTicketModal from '@/components/CreateTicketModal';
import TicketDetailsModal from '@/components/TicketDetailsModal';
import { Plus, Loader2, LayoutDashboard, Ticket as TicketIcon, ListTodo, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const router = useRouter();

    const fetchTickets = useCallback(async () => {
        setError('');
        try {
            const res = await fetch('/api/tickets');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch tickets');
            setTickets(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            // Redirect immediately if not authenticated
            router.replace('/login');
        } else if (user) {
            fetchTickets();
        }
    }, [user, authLoading, fetchTickets, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }
    // If not authenticated, don't render anything (redirect will happen)
    if (!user) {
        return null;
    }

    const isAgent = user.role === 'AGENT';

    return (
        <div className="min-h-screen pb-20">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                            {isAgent ? <ListTodo className="text-blue-500" size={40} /> : <LayoutDashboard className="text-blue-500" size={40} />}
                            {isAgent ? 'Support Queue' : 'Activity Center'}
                        </h2>
                        <p className="text-slate-400 mt-2 text-lg font-medium">
                            {isAgent ? 'Deliver exceptional support to your customers' : 'Manage your open requests and history'}
                        </p>
                    </div>

                    {!isAgent && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary flex items-center gap-3 px-8 py-3"
                        >
                            <Plus size={24} strokeWidth={3} />
                            Create Ticket
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                    </div>
                ) : error ? (
                    <div className="glass text-center py-20 rounded-3xl">
                        <div className="inline-flex items-center justify-center p-6 bg-rose-500/10 text-rose-500 rounded-full mb-6">
                            <AlertCircle size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Something went wrong</h3>
                        <p className="text-slate-500 mt-2">{error}</p>
                        <button
                            onClick={fetchTickets}
                            className="mt-6 text-blue-400 font-semibold hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="glass text-center py-20 rounded-3xl">
                        <div className="inline-flex items-center justify-center p-6 bg-slate-800 text-slate-400 rounded-full mb-6">
                            <TicketIcon size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-white">No tickets found</h3>
                        <p className="text-slate-500 mt-2">
                            {isAgent ? 'Everything is clear! No tickets to show.' : 'You haven\'t created any tickets yet.'}
                        </p>
                        {!isAgent && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-6 text-blue-600 font-semibold hover:underline"
                            >
                                Create your first ticket
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tickets.map((ticket: any) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                onUpdate={fetchTickets}
                                isAgent={isAgent}
                                onClick={() => setSelectedTicket(ticket)}
                            />
                        ))}
                    </div>
                )}
            </main>

            <CreateTicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={fetchTickets}
            />

            <TicketDetailsModal
                isOpen={!!selectedTicket}
                onClose={() => setSelectedTicket(null)}
                ticket={selectedTicket}
            />
        </div>
    );
}
