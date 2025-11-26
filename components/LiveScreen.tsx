
import React from 'react';
import { Player, Team, AuctionPhase, PlayerStatus } from '../types';
import { Clock, Activity, Shield } from 'lucide-react';

interface LiveScreenProps {
    activePlayer: Player | null;
    currentBid: number;
    timer: number;
    phase: AuctionPhase;
    lastBidTeam?: Team;
}

const LiveScreen: React.FC<LiveScreenProps> = ({ activePlayer, currentBid, timer, phase, lastBidTeam }) => {
    
    // Waiting / Setup Screen
    if (!activePlayer) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#0B0F19] text-white p-10 relative overflow-hidden font-sans">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-[#0B0F19] to-black opacity-80"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                
                {/* Floating Particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
                <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>

                <div className="z-10 text-center flex flex-col items-center animate-in fade-in zoom-in duration-1000">
                    <div className="relative mb-12 group">
                        <div className="absolute -inset-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-1000 animate-pulse"></div>
                        <Shield className="w-32 h-32 text-yellow-500 relative z-10 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                    </div>
                    <h1 className="text-9xl font-black mb-2 display-text text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">AMM YUVA</h1>
                    <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 display-text tracking-[0.2em] uppercase">
                        Cricket Auction 2024
                    </h2>
                    
                    <div className="mt-20 flex items-center gap-6 px-10 py-4 bg-white/5 border border-white/10 rounded-full backdrop-blur-md shadow-2xl">
                        <div className="relative">
                            <div className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute opacity-75"></div>
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        </div>
                        <p className="text-3xl text-slate-300 font-light tracking-widest uppercase">
                            {phase === AuctionPhase.COMPLETED ? "Auction Completed" : 
                             phase === AuctionPhase.SETUP ? "System Check" : "Waiting for Next Lot"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-[#05070a] text-white relative overflow-hidden font-sans">
            {/* Background Texture & Gradients */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full filter blur-[150px]"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full filter blur-[150px]"></div>
            
            {/* Header Bar */}
            <div className="h-28 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-12 z-20">
                <div className="flex items-center gap-4">
                    <div className="bg-red-600 text-white px-4 py-1.5 rounded font-black text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse">Live</div>
                    <div className="text-3xl font-bold text-white display-text tracking-wider opacity-80">AMM YUVA</div>
                </div>
                
                {/* Central Timer */}
                <div className={`transition-all duration-300 transform ${timer <= 5 && timer > 0 ? 'scale-125' : ''}`}>
                    <div className={`flex items-center gap-4 px-8 py-3 rounded-2xl border backdrop-blur-lg shadow-2xl transition-colors duration-300 ${
                        timer <= 5 
                            ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)]' 
                            : 'bg-black/40 border-white/10 text-white'
                    }`}>
                        <Clock className={`w-12 h-12 ${timer <= 5 ? 'animate-bounce' : ''}`} strokeWidth={2.5} />
                        <span className="text-7xl font-mono font-bold tracking-tighter tabular-nums leading-none mt-1">
                            {String(timer).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">Round</div>
                    <div className="text-xl text-yellow-500 font-bold uppercase tracking-wider glow-text">
                        {phase === AuctionPhase.LIVE_REAUCTION ? "Re-Auction" : "Initial Pot"}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex px-12 pb-12 gap-12 z-10 relative items-center">
                
                {/* Left: Player Card (Redesigned) */}
                <div className="w-[40%] h-[85%] relative perspective-1000 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2.5rem] transform rotate-1 opacity-20 group-hover:rotate-2 transition-transform duration-700"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-[2.5rem] transform -rotate-1 opacity-20 group-hover:-rotate-2 transition-transform duration-700"></div>
                    
                    <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden bg-[#121620] border border-white/10 shadow-2xl flex flex-col">
                        {/* Image Container */}
                        <div className="relative flex-1 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-transparent z-10"></div>
                            <img 
                                src={activePlayer.image} 
                                alt={activePlayer.name} 
                                className={`w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-in-out ${activePlayer.status === PlayerStatus.SOLD ? 'grayscale' : ''}`}
                            />
                            
                            {/* Floating Badges */}
                            <div className="absolute top-6 left-6 z-20 flex flex-col gap-3 items-start">
                                <div className="px-5 py-2 bg-yellow-500 text-black font-black text-lg uppercase tracking-wider rounded-lg shadow-lg transform -skew-x-12">
                                    <span className="block transform skew-x-12">{activePlayer.role}</span>
                                </div>
                            </div>

                            {/* SOLD Stamp Overlay */}
                            {activePlayer.status === PlayerStatus.SOLD && (
                                <div className="absolute inset-0 z-30 flex items-center justify-center animate-in zoom-in duration-300">
                                    <div className="border-[10px] border-green-500 text-green-500 px-12 py-4 rounded-xl transform -rotate-12 bg-black/50 backdrop-blur-sm shadow-[0_0_50px_rgba(34,197,94,0.5)]">
                                        <span className="text-9xl font-black uppercase tracking-widest drop-shadow-md">SOLD</span>
                                    </div>
                                </div>
                            )}
                            
                            {/* UNSOLD Stamp Overlay */}
                            {activePlayer.status === PlayerStatus.UNSOLD && (
                                <div className="absolute inset-0 z-30 flex items-center justify-center animate-in zoom-in duration-300">
                                    <div className="border-[10px] border-red-500 text-red-500 px-12 py-4 rounded-xl transform -rotate-12 bg-black/50 backdrop-blur-sm">
                                        <span className="text-8xl font-black uppercase tracking-widest drop-shadow-md">UNSOLD</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Name & ID */}
                        <div className="p-8 pb-10 z-20 bg-[#121620]">
                            <h2 className="text-7xl font-black display-text text-white mb-2 leading-[0.9] tracking-tight uppercase">
                                {activePlayer.name.split(' ').map((n, i) => (
                                    <span key={i} className="block">{n}</span>
                                ))}
                            </h2>
                            <div className="w-20 h-2 bg-blue-500 rounded-full mt-6 mb-2"></div>
                        </div>
                    </div>
                </div>

                {/* Right: Bidding Details */}
                <div className="flex-1 h-[85%] flex flex-col justify-between py-4">
                    
                    {/* Stats / Base Price */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex items-center gap-5 hover:bg-white/10 transition-colors">
                             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
                                <Shield className="w-8 h-8 text-slate-400" />
                             </div>
                             <div>
                                 <div className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-1">Base Price</div>
                                 <div className="text-4xl font-bold text-white font-mono tracking-tight">₹{(activePlayer.basePrice / 100000).toFixed(1)} L</div>
                             </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex items-center gap-5 hover:bg-white/10 transition-colors">
                             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
                                <Activity className="w-8 h-8 text-slate-400" />
                             </div>
                             <div>
                                 <div className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-1">Status</div>
                                 <div className={`text-3xl font-bold tracking-wide uppercase ${
                                     activePlayer.status === PlayerStatus.SOLD ? 'text-green-500' : 
                                     activePlayer.status === PlayerStatus.UNSOLD ? 'text-red-500' : 'text-white'
                                 }`}>
                                     {activePlayer.status}
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Current Bid Display - Hero Section */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-[2.5rem] blur-lg opacity-40 animate-pulse"></div>
                        <div className="relative bg-[#0F131C] rounded-[2.5rem] p-12 border border-slate-700/50 shadow-2xl overflow-hidden">
                            {/* Background Pattern in Card */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
                            
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="text-cyan-400 text-2xl uppercase tracking-[0.3em] font-bold mb-4 drop-shadow-md">Current Highest Bid</div>
                                
                                <div className="text-[10rem] leading-none font-bold text-white flex items-center display-text tracking-tighter drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                                    <span className="text-6xl text-slate-600 mr-4 font-normal align-top mt-4">₹</span>
                                    {currentBid.toLocaleString()}
                                </div>
                            </div>

                            {/* Team Holding Bid */}
                            {lastBidTeam && (
                                <div className="mt-10 pt-8 border-t border-slate-800/50 flex items-center justify-center gap-6 animate-in slide-in-from-bottom-5">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-600">
                                         <img src={lastBidTeam.logo} alt={lastBidTeam.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-4xl font-bold text-white tracking-wide">{lastBidTeam.name}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer / ID */}
                    <div className="flex justify-end items-center opacity-50">
                         <span className="font-mono text-lg tracking-widest text-slate-400">PLAYER ID: {activePlayer.id.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveScreen;