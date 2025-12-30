'use client';

import { useState } from 'react';
import { X, Loader2, Plus, AlertCircle } from 'lucide-react';

export default function CreateTicketModal({ isOpen, onClose, onCreated }: { isOpen: boolean, onClose: () => void, onCreated: () => void }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM'
    });
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsPending(true);

        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                onCreated();
                onClose();
                setFormData({ title: '', description: '', priority: 'MEDIUM' });
            } else {
                throw new Error(data.error || 'Failed to create ticket');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300">
            <div className="glass w-full max-w-lg p-10 rounded-3xl relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 text-slate-500 hover:text-white hover:rotate-90 transition-all"
                >
                    <X size={28} />
                </button>

                <div className="mb-10">
                    <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tight">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                            <Plus className="text-blue-500" size={28} />
                        </div>
                        New Request
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">Please provide the details of your support request.</p>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-8 text-sm font-semibold flex items-center gap-3 animate-in shake-in duration-300">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Subject</label>
                        <input
                            required
                            className="input"
                            placeholder="Brief summary of the issue"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Detailed Description</label>
                        <textarea
                            required
                            rows={4}
                            className="input resize-none py-4"
                            placeholder="Describe the problem in detail..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Priority Level</label>
                        <select
                            className="input appearance-none bg-slate-900/50"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="LOW" className="bg-slate-900">Low - general inquiry</option>
                            <option value="MEDIUM" className="bg-slate-900">Medium - normal support</option>
                            <option value="HIGH" className="bg-slate-900">High - critical issue</option>
                        </select>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 py-4">
                            Dismiss
                        </button>
                        <button type="submit" disabled={isPending} className="btn-primary flex-1 flex items-center justify-center gap-3 py-4">
                            {isPending ? <Loader2 className="animate-spin" size={24} /> : (
                                <>
                                    <Plus size={20} strokeWidth={3} />
                                    Submit Ticket
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
