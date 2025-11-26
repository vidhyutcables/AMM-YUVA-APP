import React, { useState } from 'react';
import { Shield, Lock, User, Users } from 'lucide-react';

interface LoginScreenProps {
    onLogin: (username: string, password: string) => void;
    onRegister: (data: any, role: 'ADMIN' | 'TEAM') => void;
    error: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister, error }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerRole, setRegisterRole] = useState<'ADMIN' | 'TEAM'>('TEAM');

    // Login State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Register State
    const [regName, setRegName] = useState(''); // Name for Admin or Team Name
    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');

    // Local error state to handle clearing errors on toggle
    const [localError, setLocalError] = useState<string | null>(null);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister({
            name: regName,
            username: regUsername,
            password: regPassword,
            logo: '🛡️' // Default logo for registered teams, to be updated by Admin if needed
        }, registerRole);
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setLocalError(null);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full filter blur-[150px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full filter blur-[150px] opacity-20 animate-pulse"></div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md z-10 animate-in fade-in zoom-in duration-500 transition-all">
                
                {/* Logo Section - Replaced Icon with Image */}
                <div className="flex justify-center mb-8">
                    {/* 
                        INSTRUCTION: Replace the src attribute below with the URL of your AMM YUVA Logo.
                        You can use a local path (if in public folder) or an external URL.
                    */}
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/16506/16506376.png" 
                        alt="AMM YUVA Logo"
                        className="w-32 h-32 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                    />
                </div>
                
                <h2 className="text-3xl font-bold text-center text-white mb-2 display-text">AMM YUVA</h2>
                <p className="text-slate-400 text-center mb-8 text-sm">Cricket Auction Management System</p>

                {/* Tabs for Registration */}
                {isRegistering && (
                    <div className="flex mb-6 bg-slate-800/50 p-1 rounded-lg">
                        <button 
                            type="button"
                            onClick={() => setRegisterRole('TEAM')}
                            className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${registerRole === 'TEAM' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Users className="w-4 h-4" /> Team
                        </button>
                        <button 
                            type="button"
                            onClick={() => setRegisterRole('ADMIN')}
                            className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${registerRole === 'ADMIN' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Shield className="w-4 h-4" /> Admin
                        </button>
                    </div>
                )}

                {/* Form Container */}
                <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit} className="space-y-5">
                    
                    {isRegistering && (
                        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                {registerRole === 'ADMIN' ? 'Full Name' : 'Team Name'}
                            </label>
                            <div className="relative">
                                {registerRole === 'ADMIN' ? (
                                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                                ) : (
                                    <Users className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                                )}
                                <input 
                                    type="text" 
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all placeholder-slate-600"
                                    placeholder={registerRole === 'ADMIN' ? "e.g. John Doe" : "e.g. Royal Strikers"}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <input 
                                type="text" 
                                value={isRegistering ? regUsername : username}
                                onChange={(e) => isRegistering ? setRegUsername(e.target.value) : setUsername(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all placeholder-slate-600"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <input 
                                type="password" 
                                value={isRegistering ? regPassword : password}
                                onChange={(e) => isRegistering ? setRegPassword(e.target.value) : setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all placeholder-slate-600"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>

                    {(error || localError) && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center font-medium animate-in shake">
                            {error || localError}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className={`w-full font-bold py-3.5 rounded-lg shadow-lg transform transition hover:-translate-y-1 active:scale-95 ${
                            isRegistering 
                            ? registerRole === 'ADMIN' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black'
                        }`}
                    >
                        {isRegistering ? (registerRole === 'ADMIN' ? 'REGISTER ADMIN' : 'REGISTER TEAM') : 'LOGIN'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={toggleMode}
                        className="text-sm text-slate-400 hover:text-white transition-colors underline decoration-slate-600 underline-offset-4"
                    >
                        {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;