import { Authorization, Transaction, Wallet } from './interfaces';
export declare class SimpleosConnect {
    private socket;
    private port;
    private wallet;
    private sessionUuid;
    constructor();
    initWallet(wallet: Wallet): void;
    getWallet(): Wallet;
    sessionCreated(): boolean;
    connectWallet(): Promise<void>;
    disconnectWallet(): void;
    isWalletConnected(): boolean;
    getAuthorizations(chainId: string): Promise<Authorization[]>;
    logIn(authorization: Authorization): Promise<void>;
    logOut(): Promise<void>;
    isLoggedIn(): Promise<boolean>;
    getCurrentAuthorization(): Promise<Authorization>;
    transact(transaction: Transaction): Promise<void>;
    private checkAvailablePorts;
    private connectSocket;
    private requestSocketConnection;
}
