import {useContext} from "react";
import {ErrorMessageContext} from "../components/Messages/ErrorMessages.tsx";

export function useErrorMessage() {
    const context = useContext(ErrorMessageContext);
    if (context === undefined) {
        throw new Error('useErrorMessage must be used within a SuccessMessageProvider');
    }
    return context;
}
