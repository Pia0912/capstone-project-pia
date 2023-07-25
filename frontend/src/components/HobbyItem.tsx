import {ChangeEvent, ChangeEventHandler, useEffect, useState} from "react";
import {Hobby} from "../models.ts";

type Props = {
    hobby: Hobby;
};

export default function HobbyItem(props: Props) {
    const [selectedColor, setSelectedColor] = useState<string>(() => (localStorage.getItem(props.hobby.id) as string) || "");

    useEffect(() => {
        if (selectedColor !== null) {
            localStorage.setItem(props.hobby.id, selectedColor);
        }
    }, [props.hobby.id, selectedColor]);

    const handleColorChange: ChangeEventHandler<HTMLSelectElement> = (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedColor(event.target.value);
    };

    const colors = [" ", "lightblue", "lightgreen", "pink", "violet", "orange", "turquoise"];

    return (
        <div className="hobby-item" style={{backgroundColor: selectedColor}}>
            <h3>{props.hobby.name}</h3>
            <select value={selectedColor} onChange={handleColorChange}>
                {colors.map((color) => (
                    <option key={color} value={color}>
                        {color}
                    </option>
                ))}
            </select>
        </div>
    );
}
