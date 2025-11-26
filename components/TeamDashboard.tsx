
import React from 'react';
import { Player, Team, AuctionPhase, BidHistoryItem } from '../types';
import { IndianRupee, Users, Wallet, Trophy, Clock, Activity, Shield } from 'lucide-react';

interface TeamDashboardProps {
    team: Team;
    players: Player[];
    activePlayer: Player | null;
    currentBid: number;
    phase: AuctionPhase;
    bidHistory: BidHistoryItem[];
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ team, players, activePlayer, currentBid, phase, bidHistory }) => {
    const myPlayers = players.filter(p => p.teamId === team.id);
    const remainingBudget = team.budget - team.spent;
    const lastBid = bidHistory.length > 0 ? bidHistory[0] : null;
    const budgetPercentage = (remainingBudget / team.budget) * 100;

    return (
        <div className="h-full flex flex-col md:flex-row bg-slate-100 text-slate-900 overflow-hidden font-sans">
            {/* Left Sidebar: Team Profile & Stats - Dark Theme for Premium Feel */}
            <div className="w-full md:w-96 bg-slate-900 text-white border-r border-slate-800 flex flex-col h-full shadow-2xl z-20 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                
                <div className="p-8 text-center border-b border-slate-800 relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700 shadow-xl mb-4 hover:scale-105 transition-transform duration-500">
                         <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-black font-serif tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">{team.name}</h1>
                    <div className="mt-2 text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em]">Official Team Console</div>
                </div>

                <div className="p-6 space-y-6 relative z-10">
                    {/* Wallet Card */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Wallet className="w-20 h-20 text-white" />
                        </div>
                        <div className="flex justify-between items-start mb-2">
                             <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Available Purse</div>
                             <Wallet className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="text-4xl font-bold text-white flex items-baseline font-mono tracking-tighter">
                            <span className="text-xl mr-1 text-slate-500">₹</span>
                            {(remainingBudget / 100000).toFixed(2)}
                            <span className="text-sm ml-2 text-slate-500 font-sans font-medium">Lakhs</span>
                        </div>
                        
                        <div className="mt-4">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase">
                                <span>Budget Utilization</span>
                                <span>{Math.round(100 - budgetPercentage)}% Used</span>
                            </div>
                            <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                                 <div className={`h-full transition-all duration-1000 ease-out rounded-full ${remainingBudget < 2000000 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-blue-400'}`} style={{width: `${budgetPercentage}%`}}></div>
                            </div>
                        </div>
                    </div>

                    {/* Squad Stats */}
                    <div className="flex gap-4">
                         <div className="flex-1 bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">{myPlayers.length}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Squad Size</span>
                         </div>
                         <div className="flex-1 bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">15</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Max Limit</span>
                         </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col px-6 pb-6 relative z-10">
                    <h3 className="font-bold text-slate-300 mb-4 flex items-center gap-2 text-xs uppercase tracking-widest border-b border-slate-800 pb-2">
                        <Trophy className="w-3 h-3 text-yellow-500" /> Roster
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {myPlayers.length === 0 ? (
                            <div className="text-center text-slate-600 py-12 text-sm italic border border-dashed border-slate-800 rounded-xl">
                                No players acquired yet.
                            </div>
                        ) : (
                            myPlayers.map(p => (
                                <div key={p.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-sm flex items-center gap-4 group hover:bg-slate-700 transition-colors">
                                    <div className="w-12 h-12 rounded-lg bg-slate-600 overflow-hidden relative">
                                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm text-white truncate group-hover:text-blue-300 transition-colors">{p.name}</div>
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wide">{p.role}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-green-400 text-sm font-mono">
                                            {(p.soldPrice! / 100000).toFixed(1)}L
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Live Auction Feed */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-40"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                
                <div className="w-full max-w-5xl z-10 flex flex-col h-full max-h-[90vh]">
                    <div className="flex items-center justify-between mb-8 shrink-0">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Live Auction Feed</h2>
                            <p className="text-slate-500 font-medium">Real-time updates from the floor</p>
                        </div>
                        <span className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm border flex items-center gap-2 ${
                             phase === AuctionPhase.LIVE_INITIAL || phase === AuctionPhase.LIVE_REAUCTION ? 'bg-green-100 text-green-700 border-green-200 animate-pulse' : 'bg-slate-200 text-slate-600 border-slate-300'
                        }`}>
                             <div className={`w-2 h-2 rounded-full ${phase === AuctionPhase.LIVE_INITIAL || phase === AuctionPhase.LIVE_REAUCTION ? 'bg-green-600' : 'bg-slate-500'}`}></div>
                            {phase.replace('_', ' ')}
                        </span>
                    </div>

                    {activePlayer ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                            {/* Main Player Card */}
                            <div className="lg:col-span-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
                                
                                <div className="relative h-2/3 bg-slate-900 overflow-hidden">
                                    <img src={activePlayer.image} alt="" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                                        <div className="flex gap-2 mb-3">
                                            <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-xs uppercase tracking-wide shadow-lg">{activePlayer.role}</span>
                                        </div>
                                        <h3 className="text-5xl font-black mb-1 shadow-black drop-shadow-lg uppercase tracking-tight">{activePlayer.name}</h3>
                                    </div>
                                </div>
                                <div className="flex-1 p-8 flex items-center justify-between bg-white relative">
                                    <div>
                                        <div className="text-xs text-slate-400 uppercase tracking-[0.2em] font-bold mb-2">Current Highest Bid</div>
                                        <div className="text-7xl font-bold text-slate-900 flex items-center tracking-tighter text-blue-600">
                                            <IndianRupee className="w-12 h-12 mr-2 stroke-[2.5]" />
                                            {currentBid.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-right bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Base Price</div>
                                        <div className="text-2xl font-bold text-slate-600 font-mono">
                                            ₹{activePlayer.basePrice.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Side Panel */}
                            <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                                {/* Latest Bid Box */}
                                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                                    
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                        <Activity className="w-8 h-8" />
                                    </div>
                                    
                                    <div className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">Latest Action</div>
                                    
                                    {lastBid ? (
                                        <div className="animate-in zoom-in duration-300 space-y-2">
                                            <div className="text-4xl font-bold text-slate-800 font-mono tracking-tight">₹{lastBid.amount.toLocaleString()}</div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">
                                                <Clock className="w-3 h-3" />
                                                {new Date(lastBid.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-slate-400 italic font-medium">No bids placed yet</div>
                                    )}
                                </div>

                                {/* Strategy Tip */}
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl shadow-xl text-white text-center border border-slate-700 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-5">
                                        <Shield className="w-24 h-24" />
                                    </div>
                                    <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">System Message</p>
                                    <p className="font-bold text-lg leading-relaxed text-slate-200">
                                        "Keep an eye on the remaining purse of your competitors."
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 border-dashed shadow-sm m-4 opacity-70">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Clock className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-400">Waiting for next player...</h3>
                            <p className="text-slate-400 mt-2">The auctioneer is preparing the next lot.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamDashboard;