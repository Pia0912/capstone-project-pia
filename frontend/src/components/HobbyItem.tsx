import {ChangeEvent, ChangeEventHandler, useEffect, useState} from "react";
import {Hobby} from "../models";

type Props = {
    hobby: Hobby;
    colors: string[];
};

export default function HobbyItem(props: Props) {
    const [selectedColor, setSelectedColor] = useState<string>(() => (localStorage.getItem(props.hobby.id) as string) || "");

    useEffect(() => {
        if (selectedColor !== null) {
            localStorage.setItem(props.hobby.id, selectedColor);
        }
    }, [props.hobby.id, selectedColor]);

    const handleColorChange: ChangeEventHandler<HTMLSelectElement> = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedColor(event.target.value);
    };

    return (
        <div style={{ backgroundColor: selectedColor }}>
            <h3>{props.hobby.name}</h3>
            <select value={selectedColor} onChange={handleColorChange}>
                {props.colors.map((colors) => (
                    <option key={colors} value={colors} >
                        {colors}
                    </option>
                ))}
            </select>
        </div>
    );
}
