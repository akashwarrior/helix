export interface ErrorState {
    type: 'network' | 'auth' | 'validation' | 'server' | null;
    message: string;
}