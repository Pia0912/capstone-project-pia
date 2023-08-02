import { useEffect } from "react";

export default function useColors(hobbyId: string): string | undefined {
    const color = localStorage.getItem(hobbyId) || undefined;

    useEffect(() => {
        if (color !== undefined) {
            localStorage.setItem(hobbyId, color);
        }
    }, [hobbyId, color]);

    return color;
}
