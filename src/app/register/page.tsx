'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, UserCheck, Loader2, Ticket, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CUSTOMER',
    });
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsPending(true);

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsPending(false);
            return;
        }

        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(formData.password)) {
            setError('Password must contain at least one special character');
            setIsPending(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Registration failed');

            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>

            <div className="glass w-full max-w-md p-10 rounded-3xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-6 group transition-transform hover:scale-110 duration-300">
                        <Ticket size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Get Started</h1>
                    <p className="text-slate-400 mt-2 font-medium">Join the support ecosystem</p>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-8 text-sm font-semibold flex items-center gap-3 animate-in shake-in duration-300">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                className="input pl-12"
                                placeholder="Enter Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Work Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                className="input pl-12"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                className="input pl-12"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Onboarding Profile</label>
                        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'CUSTOMER' })}
                                className={`py-4 rounded-xl flex flex-col items-center gap-1 transition-all ${formData.role === 'CUSTOMER'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                <User size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">User</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'AGENT' })}
                                className={`py-4 rounded-xl flex flex-col items-center gap-1 transition-all ${formData.role === 'AGENT'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                <UserCheck size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Agent</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg mt-4"
                    >
                        {isPending ? <Loader2 className="animate-spin" size={24} /> : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-10 text-slate-500 text-sm font-medium">
                    Already a member?{' '}
                    <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
