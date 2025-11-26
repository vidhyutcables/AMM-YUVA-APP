
import React, { useState, useEffect, useRef } from 'react';
import { Player, Team, AuctionState, AuctionPhase, PlayerStatus, BidHistoryItem, PlayerRole, User, Admin } from './types';
import { INITIAL_PLAYERS, INITIAL_TEAMS } from './constants';
import LiveScreen from './components/LiveScreen';
import AuctioneerDashboard from './components/AuctioneerDashboard';
import TeamDashboard from './components/TeamDashboard';
import LoginScreen from './components/LoginScreen';
import { Monitor, Shield, Users, Volume2, VolumeX, LogOut } from 'lucide-react';

enum ViewMode {
    AUCTIONEER = 'AUCTIONEER',
    PROJECTOR = 'PROJECTOR',
    TEAM = 'TEAM',
}

// Royalty-free background music loop (Action/Sports style)
const BG_MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=action-sport-rock-trailer-118442.mp3";

const App: React.FC = () => {
    // Auth State
    const [user, setUser] = useState<User | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    
    // Maintain list of admins (Starts with default)
    const [admins, setAdmins] = useState<Admin[]>([
        { id: 'admin1', username: 'admin', password: 'admin123', name: 'Master Admin' }
    ]);

    // Application State
    const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
    const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
    const [auctionState, setAuctionState] = useState<AuctionState>({
        phase: AuctionPhase.SETUP,
        activePlayerId: null,
        currentBid: 0,
        timer: 10,
        isTimerRunning: false,
        lastBidTeamId: null,
        bidHistory: []
    });

    // UI View State
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.AUCTIONEER);
    
    // Music State
    const [isMusicEnabled, setIsMusicEnabled] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio
    useEffect(() => {
        audioRef.current = new Audio(BG_MUSIC_URL);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4; // Optimized volume for background
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Smart Audio Logic: Play only if Enabled AND in a Live Phase AND Logged in
    useEffect(() => {
        if (!audioRef.current) return;

        const isLivePhase = 
            auctionState.phase === AuctionPhase.LIVE_INITIAL || 
            auctionState.phase === AuctionPhase.LIVE_REAUCTION;

        const shouldPlay = isMusicEnabled && isLivePhase && user !== null;

        if (shouldPlay) {
            if (audioRef.current.paused) {
                audioRef.current.play().catch(e => {
                    console.warn("Audio autoplay blocked by browser policy:", e);
                });
            }
        } else {
            if (!audioRef.current.paused) {
                audioRef.current.pause();
            }
        }
    }, [isMusicEnabled, auctionState.phase, user]);

    // Timer Logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (auctionState.isTimerRunning && auctionState.timer > 0) {
            interval = setInterval(() => {
                setAuctionState(prev => ({ ...prev, timer: prev.timer - 1 }));
            }, 1000);
        } else if (auctionState.timer === 0) {
            setAuctionState(prev => ({ ...prev, isTimerRunning: false }));
        }
        return () => clearInterval(interval);
    }, [auctionState.isTimerRunning, auctionState.timer]);

    // Login Handler
    const handleLogin = (u: string, p: string) => {
        setLoginError(null);
        
        // Check Admin
        const admin = admins.find(a => a.username === u && a.password === p);
        if (admin) {
            setUser({ id: admin.id, role: 'ADMIN', name: admin.name });
            setViewMode(ViewMode.AUCTIONEER);
            return;
        }

        // Check Teams
        const team = teams.find(t => t.username === u && t.password === p);
        if (team) {
            setUser({ id: team.id, role: 'TEAM', name: team.name, teamId: team.id });
            setViewMode(ViewMode.TEAM);
            return;
        }

        setLoginError("Invalid credentials");
    };

    // Registration Handler
    const handleRegister = (data: any, role: 'ADMIN' | 'TEAM') => {
        setLoginError(null);

        // Check for existing username
        const usernameExists = 
            admins.some(a => a.username === data.username) || 
            teams.some(t => t.username === data.username);
        
        if (usernameExists) {
            setLoginError("Username already exists. Please choose another.");
            return;
        }

        if (role === 'ADMIN') {
            const newAdmin: Admin = {
                id: `admin-${Date.now()}`,
                username: data.username,
                password: data.password,
                name: data.name
            };
            setAdmins(prev => [...prev, newAdmin]);
            // Auto Login
            setUser({ id: newAdmin.id, role: 'ADMIN', name: newAdmin.name });
            setViewMode(ViewMode.AUCTIONEER);
        } else {
            // Team Registration
            const newTeam: Team = {
                id: `t${Date.now()}`,
                name: data.name, // Team Name
                logo: data.logo || 'https://cdn-icons-png.flaticon.com/512/166/166258.png', // Default shield image
                budget: 10000000, // Default 10Cr for self-registered teams
                spent: 0,
                username: data.username,
                password: data.password
            };
            setTeams(prev => [...prev, newTeam]);
            // Auto Login
            setUser({ id: newTeam.id, role: 'TEAM', name: newTeam.name, teamId: newTeam.id });
            setViewMode(ViewMode.TEAM);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setViewMode(ViewMode.AUCTIONEER); // Reset default
    };

    // Helpers
    const getActivePlayer = () => players.find(p => p.id === auctionState.activePlayerId) || null;
    const getLastBidTeam = () => teams.find(t => t.id === auctionState.lastBidTeamId);

    // Actions
    const handleStartAuction = () => {
        setAuctionState(prev => ({ ...prev, phase: AuctionPhase.LIVE_INITIAL }));
    };

    const handleNextPlayer = () => {
        let eligiblePlayers: Player[] = [];
        
        if (auctionState.phase === AuctionPhase.LIVE_INITIAL) {
            eligiblePlayers = players.filter(p => p.status === PlayerStatus.AVAILABLE);
        } else if (auctionState.phase === AuctionPhase.LIVE_REAUCTION) {
            eligiblePlayers = players.filter(p => p.status === PlayerStatus.UNSOLD);
        }

        if (eligiblePlayers.length === 0) {
            alert("No players available in this pool.");
            return;
        }

        const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
        const selectedPlayer = eligiblePlayers[randomIndex];

        setAuctionState(prev => ({
            ...prev,
            activePlayerId: selectedPlayer.id,
            currentBid: selectedPlayer.basePrice,
            timer: 10,
            isTimerRunning: false,
            lastBidTeamId: null,
            bidHistory: [] // Reset history for new player
        }));
    };

    const handleStartReAuction = () => {
        setAuctionState(prev => ({ ...prev, phase: AuctionPhase.LIVE_REAUCTION }));
    };

    const handleBidUpdate = (amount: number) => {
        const newHistoryItem: BidHistoryItem = {
            amount,
            timestamp: Date.now()
        };

        setAuctionState(prev => ({ 
            ...prev, 
            currentBid: amount,
            bidHistory: [newHistoryItem, ...prev.bidHistory] // Prepend new bid
        }));
    };

    const handleTimerControl = (action: 'start' | 'pause' | 'reset' | 'add') => {
        setAuctionState(prev => {
            if (action === 'start') return { ...prev, isTimerRunning: true };
            if (action === 'pause') return { ...prev, isTimerRunning: false };
            if (action === 'reset') return { ...prev, timer: 10, isTimerRunning: false };
            return prev;
        });
    };

    const handleSold = (teamId: string, amount: number) => {
        const activePlayer = getActivePlayer();
        if (!activePlayer) return;

        // 1. Update Player
        const updatedPlayers = players.map(p => 
            p.id === activePlayer.id 
                ? { ...p, status: PlayerStatus.SOLD, soldPrice: amount, teamId: teamId } 
                : p
        );
        setPlayers(updatedPlayers);

        // 2. Update Team Budget
        const updatedTeams = teams.map(t => 
            t.id === teamId 
                ? { ...t, spent: t.spent + amount } 
                : t
        );
        setTeams(updatedTeams);

        // 3. Reset Auction State for next (Keep player active to show SOLD status)
        setAuctionState(prev => ({
            ...prev,
            // Do not clear activePlayerId yet so we can see the SOLD stamp
            isTimerRunning: false,
            lastBidTeamId: teamId,
        }));
    };

    const handleUnsold = () => {
        const activePlayer = getActivePlayer();
        if (!activePlayer) return;

        // 1. Update Player
        const updatedPlayers = players.map(p => 
            p.id === activePlayer.id 
                ? { ...p, status: PlayerStatus.UNSOLD } 
                : p
        );
        setPlayers(updatedPlayers);

        // 2. Reset Auction State (Keep player active to show UNSOLD stamp)
        setAuctionState(prev => ({
            ...prev,
            isTimerRunning: false,
            lastBidTeamId: null,
        }));
    };

    const handleAddPlayer = (playerData: any) => {
        const newPlayer: Player = {
            id: `p${Date.now()}`,
            name: playerData.name,
            basePrice: playerData.basePrice,
            // Category removed
            role: playerData.role,
            image: playerData.image || 'https://www.w3schools.com/w3images/avatar2.png',
            status: PlayerStatus.AVAILABLE
        };
        setPlayers(prev => [...prev, newPlayer]);
    };

    const handleAddTeam = (teamData: any) => {
        const newTeam: Team = {
            id: `t${Date.now()}`,
            name: teamData.name,
            logo: teamData.logo,
            budget: teamData.budget,
            spent: 0,
            username: teamData.username,
            password: teamData.password
        };
        setTeams(prev => [...prev, newTeam]);
    };

    // --- Render Logic ---

    if (!user) {
        return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} error={loginError} />;
    }

    return (
        <div className="min-h-screen flex flex-col font-sans bg-slate-50">
            {/* Top Bar - Premium Dark Glassmorphism */}
            <div className="bg-slate-900/95 backdrop-blur-md text-white h-16 flex justify-between items-center px-6 shadow-xl z-50 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${user.role === 'ADMIN' ? 'bg-orange-500 shadow-orange-500/50' : 'bg-green-500 shadow-green-500/50'} shadow-lg animate-pulse`}></div>
                    <div className="flex flex-col">
                        <span className="font-black text-lg tracking-widest text-white leading-none">AMM YUVA</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auction System v2.0</span>
                    </div>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-2 bg-slate-800/50 px-4 py-1.5 rounded-full border border-white/5">
                    <span className="text-xs text-slate-400 font-medium">Logged in as</span>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {user.role === 'ADMIN' ? <Shield className="w-3 h-3 text-orange-400" /> : <Users className="w-3 h-3 text-blue-400" />}
                        {user.name}
                    </span>
                </div>

                <div className="flex items-center gap-5">
                     {/* Music Toggle - Only for Admin or if decided globally */}
                     {(user.role === 'ADMIN' || viewMode === ViewMode.PROJECTOR) && (
                         <div className="flex items-center gap-2">
                             <button 
                                onClick={() => setIsMusicEnabled(!isMusicEnabled)}
                                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-105 ${isMusicEnabled ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                title="Toggle Music"
                            >
                                {isMusicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            </button>
                         </div>
                     )}

                    {user.role === 'ADMIN' && (
                        <>
                            <div className="h-6 w-px bg-slate-700 mx-1"></div>
                            {/* Role Switcher for Admin only */}
                            <div className="flex gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
                                <button 
                                    onClick={() => setViewMode(ViewMode.AUCTIONEER)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${viewMode === ViewMode.AUCTIONEER ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                >
                                    <Shield className="w-3 h-3" /> CONTROL
                                </button>
                                <button 
                                    onClick={() => setViewMode(ViewMode.PROJECTOR)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${viewMode === ViewMode.PROJECTOR ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                >
                                    <Monitor className="w-3 h-3" /> SCREEN
                                </button>
                            </div>
                        </>
                    )}
                    
                    <button onClick={handleLogout} className="ml-2 text-slate-400 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-full">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {viewMode === ViewMode.PROJECTOR && (
                    <LiveScreen 
                        activePlayer={getActivePlayer()}
                        currentBid={auctionState.currentBid}
                        timer={auctionState.timer}
                        phase={auctionState.phase}
                        lastBidTeam={getLastBidTeam()}
                    />
                )}

                {viewMode === ViewMode.AUCTIONEER && user.role === 'ADMIN' && (
                    <AuctioneerDashboard 
                        players={players}
                        teams={teams}
                        phase={auctionState.phase}
                        activePlayer={getActivePlayer()}
                        currentBid={auctionState.currentBid}
                        timer={auctionState.timer}
                        isTimerRunning={auctionState.isTimerRunning}
                        bidHistory={auctionState.bidHistory}
                        onStartAuction={handleStartAuction}
                        onNextPlayer={handleNextPlayer}
                        onStartReAuction={handleStartReAuction}
                        onBidUpdate={handleBidUpdate}
                        onTimerControl={handleTimerControl}
                        onSold={handleSold}
                        onUnsold={handleUnsold}
                        onAddPlayer={handleAddPlayer}
                        onAddTeam={handleAddTeam}
                        onLogout={handleLogout}
                    />
                )}

                {/* Team Dashboard - Shows if logged in as team OR if Admin switches to team view */}
                {viewMode === ViewMode.TEAM && user.teamId && (
                    <TeamDashboard 
                        team={teams.find(t => t.id === user.teamId) || teams[0]}
                        players={players}
                        activePlayer={getActivePlayer()}
                        currentBid={auctionState.currentBid}
                        phase={auctionState.phase}
                        bidHistory={auctionState.bidHistory}
                    />
                )}
            </div>
        </div>
    );
};

export default App;