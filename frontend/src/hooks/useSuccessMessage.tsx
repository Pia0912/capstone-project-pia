import {useContext} from "react";
import { SuccessMessageContext } from '../components/Messages/SuccessMessages.tsx';

export function useSuccessMessage() {
    const context = useContext(SuccessMessageContext);
    if (context === undefined) {
        throw new Error('useSuccessMessage must be used within a SuccessMessageProvider');
    }
    return context;
}
