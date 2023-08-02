import { useEffect, useState } from "react";

export default function useColors(id: string): [string, (color: string) => void] {
    const [color, setColor] = useState<string>(() => localStorage.getItem(id) || "");

    useEffect(() => {
        if (color !== "") {
            localStorage.setItem(id, color);
        }
    }, [id, color]);

    return [color, setColor];
}
