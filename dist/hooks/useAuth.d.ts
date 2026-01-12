export declare function useAuth(): {
    apiKey: string | null;
    isAuthenticated: boolean;
    login: (key: string) => void;
    logout: () => void;
};
