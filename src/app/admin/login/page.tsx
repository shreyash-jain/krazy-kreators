"use client";

import { useState } from "react";

import { Eye, EyeOff, Lock } from "lucide-react";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                // Set simple auth token (in real app use HTTP-only cookies)
                localStorage.setItem("admin_auth", "true");
                // Force a hard reload to trigger the layout check or redirect
                window.location.href = "/admin";
            } else {
                setError("Invalid credentials");
            }
        } catch {
            setError("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-black text-white p-12 flex flex-col justify-between relative overflow-hidden">
                <div className="z-10">
                    <div className="text-2xl font-bold mb-2">Krazy Kreators</div>
                    <div className="text-white/60">Admin Portal</div>
                </div>
                <div className="z-10 max-w-md">
                    <h1 className="text-4xl font-bold mb-4">Welcome back.</h1>
                    <p className="text-lg text-white/70">Manage your blogs, leads, and analytics from one central dashboard.</p>
                </div>
                {/* Abstract Visual Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gray-800 rounded-full blur-3xl opacity-50 pointer-events-none" />
            </div>

            <div className="flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                           <Lock className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Sign in to Admin</h2>
                        <p className="text-sm text-gray-500 mt-2">Enter your credentials to access the dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Username</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                placeholder="Enter username"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                             <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
                                {error}
                             </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg shadow-black/20"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
