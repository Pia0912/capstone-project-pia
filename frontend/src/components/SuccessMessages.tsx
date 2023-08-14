import { createContext, useContext, useState } from 'react';

const SuccessMessageContext = createContext<{
    successMessage: string | null;
    showSuccessMessage: (message: string) => void;
    clearSuccessMessage: () => void;
} | undefined>(undefined);

export function SuccessMessage({ children }: { children: React.ReactNode }) {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
    };

    const clearSuccessMessage = () => {
        setSuccessMessage(null);
    };

    return (
        <SuccessMessageContext.Provider value={{ successMessage, showSuccessMessage, clearSuccessMessage }}>
            {children}
        </SuccessMessageContext.Provider>
    );
}

export function useSuccessMessage() {
    const context = useContext(SuccessMessageContext);
    if (context === undefined) {
        throw new Error('useSuccessMessage must be used within a SuccessMessageProvider');
    }
    return context;
}
