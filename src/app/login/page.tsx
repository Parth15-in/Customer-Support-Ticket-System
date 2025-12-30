'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, UserCheck, Loader2, Ticket, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsPending(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Login failed');

            login(data.user, data.token);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>

            <div className="glass w-full max-w-md p-10 rounded-3xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-6 group transition-transform hover:scale-110 duration-300">
                        <Ticket size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Welcome Back</h1>
                    <p className="text-slate-400 mt-2 font-medium">Securely sign in to your support portal</p>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-8 text-sm font-semibold flex items-center gap-3 animate-in shake-in duration-300">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                className="input pl-12"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                className="input pl-12"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg"
                    >
                        {isPending ? <Loader2 className="animate-spin" size={24} /> : 'Log in'}
                    </button>
                </form>

                <p className="text-center mt-10 text-slate-500 text-sm font-medium">
                    New to TicketFlow?{' '}
                    <Link href="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}
