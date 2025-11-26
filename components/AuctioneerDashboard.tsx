
import React, { useState } from 'react';
import { Player, Team, AuctionPhase, PlayerStatus, BidHistoryItem, PlayerRole } from '../types';
import { Play, Pause, RotateCcw, UserPlus, DollarSign, Users, Trophy, Gavel, Search, History, Plus, X, Image as ImageIcon, Briefcase, Lock, ChevronRight, Activity } from 'lucide-react';

interface AuctioneerDashboardProps {
    players: Player[];
    teams: Team[];
    phase: AuctionPhase;
    activePlayer: Player | null;
    currentBid: number;
    timer: number;
    isTimerRunning: boolean;
    bidHistory: BidHistoryItem[];
    onStartAuction: () => void;
    onNextPlayer: () => void;
    onStartReAuction: () => void;
    onBidUpdate: (amount: number) => void;
    onTimerControl: (action: 'start' | 'pause' | 'reset' | 'add') => void;
    onSold: (teamId: string, amount: number) => void;
    onUnsold: () => void;
    onAddPlayer: (player: any) => void;
    onAddTeam: (team: any) => void;
    onLogout: () => void;
}

const AuctioneerDashboard: React.FC<AuctioneerDashboardProps> = ({
    players,
    teams,
    phase,
    activePlayer,
    currentBid,
    timer,
    isTimerRunning,
    bidHistory,
    onStartAuction,
    onNextPlayer,
    onStartReAuction,
    onBidUpdate,
    onTimerControl,
    onSold,
    onUnsold,
    onAddPlayer,
    onAddTeam,
    onLogout
}) => {
    const [manualBidInput, setManualBidInput] = useState<string>('');
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modals
    const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
    const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);

    // Form States
    const [newPlayer, setNewPlayer] = useState({
        name: '',
        basePrice: 100000,
        role: PlayerRole.BATSMAN,
        image: ''
    });

    const [newTeam, setNewTeam] = useState({
        name: '',
        logo: '',
        budget: 10000000,
        username: '',
        password: ''
    });

    const soldCount = players.filter(p => p.status === PlayerStatus.SOLD).length;
    const unsoldCount = players.filter(p => p.status === PlayerStatus.UNSOLD).length;
    const remainingCount = players.filter(p => p.status === PlayerStatus.AVAILABLE).length;

    const filteredPlayers = players.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleManualBidSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseInt(manualBidInput);
        if (!isNaN(amount)) {
            onBidUpdate(amount);
            setManualBidInput('');
        }
    };

    const handleQuickBid = (increment: number) => {
        onBidUpdate(currentBid + increment);
    };

    const handleAddPlayerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddPlayer(newPlayer);
        setIsAddPlayerModalOpen(false);
        setNewPlayer({ name: '', basePrice: 100000, role: PlayerRole.BATSMAN, image: '' });
    };

    const handleAddTeamSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTeam(newTeam);
        setIsAddTeamModalOpen(false);
        setNewTeam({ name: '', logo: '', budget: 10000000, username: '', password: '' });
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 text-slate-900 relative font-sans">
            {/* Top Stats Bar - Mission Control Style */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0 shadow-sm z-20 relative">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Gavel className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 leading-tight">Auction Control</h2>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator Panel</div>
                    </div>
                </div>

                <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                    <div className="px-4 py-1 rounded-md bg-white shadow-sm border border-slate-200 flex flex-col items-center min-w-[80px]">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Sold</span>
                        <span className="text-green-600 font-bold text-lg leading-none">{soldCount}</span>
                    </div>
                    <div className="px-4 py-1 rounded-md bg-white shadow-sm border border-slate-200 flex flex-col items-center min-w-[80px]">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unsold</span>
                        <span className="text-red-600 font-bold text-lg leading-none">{unsoldCount}</span>
                    </div>
                    <div className="px-4 py-1 rounded-md bg-white shadow-sm border border-slate-200 flex flex-col items-center min-w-[80px]">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending</span>
                        <span className="text-blue-600 font-bold text-lg leading-none">{remainingCount}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border flex items-center gap-2 ${
                        phase === AuctionPhase.LIVE_INITIAL ? 'bg-green-50 text-green-700 border-green-200' :
                        phase === AuctionPhase.LIVE_REAUCTION ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        phase === AuctionPhase.COMPLETED ? 'bg-slate-100 text-slate-700 border-slate-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${phase === AuctionPhase.COMPLETED ? 'bg-slate-400' : 'bg-current animate-pulse'}`}></div>
                        {phase.replace('_', ' ')}
                    </span>
                    <button onClick={onLogout} className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors px-2">LOGOUT</button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Column: Player List & Search */}
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                         <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                <Users className="w-4 h-4 text-slate-400" /> Player Pool
                            </h3>
                            <button 
                                onClick={() => setIsAddPlayerModalOpen(true)}
                                className="text-xs bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-md flex items-center gap-1 font-semibold transition-all shadow hover:shadow-md"
                            >
                                <Plus className="w-3 h-3" /> New
                            </button>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search players..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        {filteredPlayers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
                                <Search className="w-8 h-8 mb-2 opacity-20" />
                                {players.length === 0 ? "Pool is empty." : "No matches found."}
                            </div>
                        ) : (
                            filteredPlayers.map(player => (
                                <div key={player.id} className={`p-3 mb-2 rounded-lg border text-sm flex items-center gap-3 transition-all relative overflow-hidden group ${
                                    player.status === PlayerStatus.SOLD ? 'bg-green-50/50 border-green-100' :
                                    player.status === PlayerStatus.UNSOLD ? 'bg-red-50/50 border-red-100' :
                                    'bg-white border-slate-100 hover:border-blue-300 hover:shadow-md cursor-default'
                                }`}>
                                    <div className="relative w-10 h-10">
                                        <img src={player.image} alt="" className="w-full h-full rounded-full object-cover border border-slate-200" />
                                        {player.status === PlayerStatus.SOLD && <div className="absolute inset-0 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-[1px]"><DollarSign className="w-4 h-4 text-green-700" /></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold truncate ${player.status !== PlayerStatus.AVAILABLE ? 'text-slate-500' : 'text-slate-700 group-hover:text-blue-700'}`}>{player.name}</div>
                                        <div className="text-xs text-slate-500">{player.role}</div>
                                    </div>
                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                        player.status === PlayerStatus.SOLD ? 'bg-green-100 text-green-700' :
                                        player.status === PlayerStatus.UNSOLD ? 'bg-red-100 text-red-700' : 
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {player.status === PlayerStatus.SOLD ? 'SOLD' : 
                                        player.status === PlayerStatus.UNSOLD ? 'UNSOLD' : 
                                        `₹${(player.basePrice / 1000)}k`}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Middle Column: Active Auction Controls */}
                <div className="flex-1 bg-slate-100 p-6 flex flex-col overflow-y-auto relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                    {phase === AuctionPhase.SETUP && (
                        <div className="flex flex-col items-center justify-center h-full gap-8 z-10 animate-in fade-in zoom-in duration-500">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-200 relative">
                                <div className="absolute inset-0 rounded-full border-4 border-blue-50 animate-ping"></div>
                                <Gavel className="w-16 h-16 text-blue-600" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-4xl font-bold text-slate-800 mb-2 font-serif">AMM YUVA Auction</h2>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    System is ready. Ensure all teams and players are registered before commencing the event.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={onStartAuction}
                                    disabled={teams.length === 0 || players.length === 0}
                                    className="px-8 py-4 bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-3"
                                >
                                    <Play className="w-5 h-5 fill-current" /> Initialize Auction
                                </button>
                            </div>
                            <div className="flex gap-8 text-sm text-slate-400 font-medium">
                                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {teams.length} Teams Ready</span>
                                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {players.length} Players Loaded</span>
                            </div>
                        </div>
                    )}

                    {(phase === AuctionPhase.LIVE_INITIAL || phase === AuctionPhase.LIVE_REAUCTION) && !activePlayer && (
                        <div className="flex flex-col items-center justify-center h-full gap-8 z-10">
                             <div className="relative">
                                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center animate-pulse">
                                    <UserPlus className="w-10 h-10 text-slate-400" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white">
                                    LIVE
                                </div>
                             </div>
                            
                            <div className="text-center space-y-2">
                                <h3 className="text-3xl font-bold text-slate-700">Next Lot Selection</h3>
                                <p className="text-slate-500">
                                    {phase === AuctionPhase.LIVE_REAUCTION ? "Select from Unsold Pool" : "Random Selection from Main Pool"}
                                </p>
                            </div>

                            <button 
                                onClick={onNextPlayer}
                                className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-2xl shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center gap-4 group"
                            >
                                <span className="group-hover:rotate-12 transition-transform duration-300"><UserPlus className="w-8 h-8" /></span>
                                Reveal Next Player
                            </button>

                            {phase === AuctionPhase.LIVE_INITIAL && remainingCount === 0 && (
                                <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl text-center max-w-md shadow-sm">
                                    <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                                    <h4 className="font-bold text-yellow-800 text-lg mb-1">Initial Round Complete</h4>
                                    <p className="text-sm text-yellow-700 mb-4">All available players have been processed.</p>
                                    <button 
                                        onClick={onStartReAuction}
                                        className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold shadow transition-colors"
                                    >
                                        Start Re-Auction Round
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activePlayer && (
                        <div className="flex gap-6 h-full z-10 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Main Action Area */}
                            <div className="flex-1 flex flex-col gap-4">
                                {/* Player Header Card */}
                                <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200 flex gap-6 items-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Briefcase className="w-32 h-32" />
                                    </div>
                                    <div className="relative w-28 h-28 rounded-lg overflow-hidden shadow-md ring-4 ring-slate-50">
                                        <img src={activePlayer.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 z-10">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-4xl font-bold text-slate-800 tracking-tight font-serif">{activePlayer.name}</h2>
                                                <div className="flex gap-3 mt-3">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-bold uppercase tracking-wide border border-slate-200 flex items-center gap-1">
                                                        <Briefcase className="w-3 h-3" /> {activePlayer.role}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Base Price</div>
                                                <div className="text-2xl font-bold text-slate-700 font-mono">₹{activePlayer.basePrice.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Bid & Timer Section */}
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-7 bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col justify-center items-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-blue-600 opacity-[0.02]"></div>
                                        <div className="text-xs text-slate-400 uppercase font-bold tracking-[0.2em] mb-2 z-10">Current Highest Bid</div>
                                        <div className="text-6xl font-bold text-blue-600 flex items-center z-10 tracking-tighter">
                                            <span className="text-3xl mr-2 text-blue-300 font-light">₹</span>
                                            {currentBid.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="col-span-5 bg-white p-5 rounded-xl shadow-md border border-slate-200 flex flex-col justify-between relative overflow-hidden">
                                        <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 ${timer <= 3 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                        <div className="flex justify-between items-center mb-2 z-10">
                                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Timer</span>
                                            <span className={`text-5xl font-mono font-bold leading-none ${timer <= 3 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
                                                {String(timer).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 z-10 mt-auto">
                                            <button 
                                                onClick={() => onTimerControl(isTimerRunning ? 'pause' : 'start')}
                                                className={`flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${isTimerRunning ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'}`}
                                            >
                                                {isTimerRunning ? <><Pause className="w-4 h-4" /> PAUSE</> : <><Play className="w-4 h-4 fill-current" /> START</>}
                                            </button>
                                            <button onClick={() => onTimerControl('reset')} className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition-colors border border-slate-200">
                                                <RotateCcw className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Bidding Interface */}
                                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex-1 flex flex-col">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-blue-500" /> Bidding Console
                                    </h4>
                                    
                                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                                        {[10000, 20000, 50000, 100000, 200000, 500000].map(amt => (
                                            <button 
                                                key={amt}
                                                onClick={() => handleQuickBid(amt)}
                                                className="py-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-slate-600 rounded-lg border border-slate-200 text-sm font-bold transition-all shadow-sm active:scale-95"
                                            >
                                                +{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}
                                            </button>
                                        ))}
                                    </div>

                                    <form onSubmit={handleManualBidSubmit} className="flex gap-3 mb-8">
                                        <div className="relative flex-1">
                                            <span className="absolute left-4 top-3 text-slate-400 font-bold">₹</span>
                                            <input 
                                                type="number" 
                                                value={manualBidInput}
                                                onChange={(e) => setManualBidInput(e.target.value)}
                                                placeholder="Custom amount..."
                                                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 shadow-inner"
                                            />
                                        </div>
                                        <button type="submit" className="px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors shadow-lg">
                                            Update
                                        </button>
                                    </form>

                                    {/* Final Decision */}
                                    <div className="mt-auto pt-6 border-t border-slate-100">
                                        <div className="flex gap-4 items-end">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Assign Winner</label>
                                                <div className="relative">
                                                    <select 
                                                        value={selectedTeamId}
                                                        onChange={(e) => setSelectedTeamId(e.target.value)}
                                                        className={`w-full px-4 py-3 pr-10 border rounded-xl text-sm focus:outline-none focus:ring-2 appearance-none font-semibold cursor-pointer transition-all shadow-sm ${
                                                            selectedTeamId 
                                                            ? 'border-green-500 bg-green-50 text-green-800 focus:ring-green-500' 
                                                            : 'border-slate-300 bg-white text-slate-700 focus:ring-blue-500'
                                                        }`}
                                                    >
                                                        <option value="">Select Winning Team...</option>
                                                        {teams.map(t => {
                                                            const rem = t.budget - t.spent;
                                                            const canAfford = rem >= currentBid;
                                                            return (
                                                                <option key={t.id} value={t.id} disabled={!canAfford}>
                                                                    {t.name} (Bal: {(rem/100000).toFixed(2)}L)
                                                                </option>
                                                            )
                                                        })}
                                                    </select>
                                                    <ChevronRight className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                                </div>
                                            </div>
                                            
                                            <button 
                                                disabled={!selectedTeamId}
                                                onClick={() => {
                                                    if(selectedTeamId) {
                                                        onSold(selectedTeamId, currentBid);
                                                        setSelectedTeamId('');
                                                    }
                                                }}
                                                className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                                            >
                                                <Gavel className="w-5 h-5" /> SOLD
                                            </button>
                                            
                                            <button 
                                                onClick={onUnsold}
                                                className="px-6 py-3 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 rounded-xl font-bold transition-all shadow-sm hover:shadow-md"
                                            >
                                                Pass / Unsold
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Bid History */}
                            <div className="w-72 bg-white rounded-xl shadow-md border border-slate-200 flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                                    <History className="w-4 h-4 text-slate-500" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Live Bid Log</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-0 scrollbar-thin bg-slate-50/50">
                                    {bidHistory.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm italic">
                                            <Activity className="w-8 h-8 mb-2 opacity-20" />
                                            Waiting for opening bid
                                        </div>
                                    ) : (
                                        bidHistory.map((bid, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 border-b border-slate-100 bg-white last:border-0 hover:bg-slate-50 transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bid #{bidHistory.length - idx}</span>
                                                    <span className="font-bold text-slate-700 font-mono">₹{bid.amount.toLocaleString()}</span>
                                                </div>
                                                <span className="text-[10px] font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">
                                                    {new Date(bid.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' })}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-2 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 text-center font-bold uppercase tracking-widest">
                                    Session ID: {activePlayer.id}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Far Right Column: Teams Overview */}
                <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4" /> Team Standings
                        </h3>
                         <button 
                            onClick={() => setIsAddTeamModalOpen(true)}
                            className="text-xs bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded shadow-sm flex items-center gap-1 font-bold transition-all"
                        >
                            <Plus className="w-3 h-3" /> Add
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                        {teams.length === 0 ? (
                             <div className="text-center text-slate-400 py-10 text-sm">No teams registered.</div>
                        ) : (
                            teams.map(team => {
                                const remaining = team.budget - team.spent;
                                const teamPlayers = players.filter(p => p.teamId === team.id);
                                const budgetPercent = (team.spent / team.budget) * 100;
                                
                                return (
                                    <div key={team.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                        {/* Progress Bar Background */}
                                        <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
                                            <div 
                                                className={`h-full transition-all duration-500 ${remaining < 2000000 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                                style={{ width: `${budgetPercent}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                                    <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-sm text-slate-800 leading-tight truncate">{team.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{teamPlayers.length} / 15 Players</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center bg-slate-50 rounded-lg p-2 border border-slate-100">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-slate-400 uppercase font-bold">Remaining</span>
                                                <span className={`text-xs font-bold font-mono ${remaining < 2000000 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {(remaining / 100000).toFixed(1)}L
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] text-slate-400 uppercase font-bold">Spent</span>
                                                <span className="text-xs font-bold text-slate-700 font-mono">{(team.spent / 100000).toFixed(1)}L</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Reuse existing Modals (Add Player / Add Team) - Kept functionality same, just ensuring style match */}
            {isAddPlayerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden scale-100 border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-lg">Add New Player</h3>
                            <button onClick={() => setIsAddPlayerModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddPlayerSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                                    <input type="text" required value={newPlayer.name} onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium" placeholder="e.g. Virat Kohli" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Base Price (₹)</label>
                                        <input type="number" required min="0" value={newPlayer.basePrice} onChange={(e) => setNewPlayer({...newPlayer, basePrice: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Role</label>
                                        <select value={newPlayer.role} onChange={(e) => setNewPlayer({...newPlayer, role: e.target.value as PlayerRole})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 font-medium">
                                            {Object.values(PlayerRole).map(role => <option key={role} value={role}>{role}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Photo URL</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input type="url" value={newPlayer.image} onChange={(e) => setNewPlayer({...newPlayer, image: e.target.value})} className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium" placeholder="https://..." />
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddPlayerModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">Confirm Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAddTeamModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden scale-100 border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-lg">Register New Team</h3>
                            <button onClick={() => setIsAddTeamModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddTeamSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Team Name</label>
                                    <input type="text" required value={newTeam.name} onChange={(e) => setNewTeam({...newTeam, name: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium" placeholder="e.g. Royal Strikers" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Total Purse (₹)</label>
                                        <input type="number" required min="0" value={newTeam.budget} onChange={(e) => setNewTeam({...newTeam, budget: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Logo URL</label>
                                        <input type="url" required value={newTeam.logo} onChange={(e) => setNewTeam({...newTeam, logo: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium" placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 mt-2">
                                    <h4 className="text-xs font-bold text-blue-800 mb-3 flex items-center gap-2 uppercase tracking-wide"><Lock className="w-3 h-3"/> Access Credentials</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <input type="text" required value={newTeam.username} onChange={(e) => setNewTeam({...newTeam, username: e.target.value})} className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 text-sm" placeholder="Username" />
                                        </div>
                                        <div>
                                            <input type="text" required value={newTeam.password} onChange={(e) => setNewTeam({...newTeam, password: e.target.value})} className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 text-sm" placeholder="Password" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddTeamModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">Create Team</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuctioneerDashboard;