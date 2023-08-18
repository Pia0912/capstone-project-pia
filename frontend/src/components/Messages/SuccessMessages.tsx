import {createContext, useMemo, useState} from 'react';

export const SuccessMessageContext = createContext<{
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

    const contextValue = useMemo(() => ({
        successMessage,
        showSuccessMessage,
        clearSuccessMessage,
    }), [successMessage]);

    return (
        <SuccessMessageContext.Provider value={contextValue}>
            {children}
        </SuccessMessageContext.Provider>
    );
}
