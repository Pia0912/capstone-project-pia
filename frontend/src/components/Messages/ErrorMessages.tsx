import { createContext, useMemo, useState } from 'react';

export const ErrorMessageContext = createContext<{
    errorMessage: string | null;
    showErrorMessage: (message: string) => void;
    clearErrorMessage: () => void;
} | undefined>(undefined);

export function ErrorMessages({ children }: { children: React.ReactNode }) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
    };

    const clearErrorMessage = () => {
        setErrorMessage(null);
    };

    const contextValue = useMemo(() => ({
        errorMessage,
        showErrorMessage,
        clearErrorMessage,
    }), [errorMessage]);

    return (
        <ErrorMessageContext.Provider value={contextValue}>
            {children}
        </ErrorMessageContext.Provider>
    );
}
