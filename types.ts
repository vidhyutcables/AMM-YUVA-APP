
export enum PlayerStatus {
    AVAILABLE = 'AVAILABLE',
    SOLD = 'SOLD',
    UNSOLD = 'UNSOLD',
}

export enum AuctionPhase {
    SETUP = 'SETUP',
    LIVE_INITIAL = 'LIVE_INITIAL',
    LIVE_REAUCTION = 'LIVE_REAUCTION',
    COMPLETED = 'COMPLETED',
}

export enum PlayerRole {
    BATSMAN = 'Batsman',
    BOWLER = 'Bowler',
    ALL_ROUNDER = 'All Rounder',
    WICKET_KEEPER = 'Wicket Keeper',
}

export interface Player {
    id: string;
    name: string;
    basePrice: number;
    // Category removed
    role: PlayerRole;
    image: string;
    status: PlayerStatus;
    soldPrice?: number;
    teamId?: string; // ID of the team that bought the player
}

export interface Team {
    id: string;
    name: string;
    logo: string;
    budget: number;
    spent: number;
    username?: string; // For login
    password?: string; // For login
}

export interface Admin {
    id: string;
    username: string;
    password: string;
    name: string;
}

export interface BidHistoryItem {
    amount: number;
    timestamp: number;
    teamName?: string; // Optional, mostly for logging
}

export interface AuctionState {
    phase: AuctionPhase;
    activePlayerId: string | null;
    currentBid: number;
    timer: number;
    isTimerRunning: boolean;
    lastBidTeamId: string | null;
    bidHistory: BidHistoryItem[];
}

export interface User {
    id: string;
    role: 'ADMIN' | 'TEAM';
    name: string;
    teamId?: string;
}