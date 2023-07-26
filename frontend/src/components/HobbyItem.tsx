import {ChangeEvent, ChangeEventHandler, useEffect, useState} from "react";
import {Hobby} from "../models";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

type Props = {
    hobby: Hobby;
    colors: string[];
    onEditHobby: (hobbyId: string, newName: string) => void;
};

export default function HobbyItem(props: Props) {
    const [selectedColor, setSelectedColor] = useState<string>(() => (localStorage.getItem(props.hobby.id) as string) || "");
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(props.hobby.name);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        props.onEditHobby(props.hobby.id, editedName);
        setIsEditing(false);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditedName(event.target.value);
    };

    useEffect(() => {
        if (selectedColor !== null) {
            localStorage.setItem(props.hobby.id, selectedColor);
        }
    }, [props.hobby.id, selectedColor]);

    const handleColorChange: ChangeEventHandler<HTMLSelectElement> = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedColor(event.target.value);
    };

    return (
        <div style={{ backgroundColor: selectedColor, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editedName}
                        onChange={handleInputChange}
                    />
                    <Button variant="outlined" onClick={handleSaveClick} sx={{borderColor: 'black', color: 'black'}}>
                        Save
                    </Button>
                </>
            ) : (
                <>
                    <div className="edit">
                        <h3>{props.hobby.name}</h3>
                        <IconButton aria-label="edit hobby" onClick={handleEditClick} sx={{ p: 0, width: '32px', height: '32px', transform: 'translateY(-4px)' }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </div>
                    <select value={selectedColor} onChange={handleColorChange}>
                        {props.colors.map((colors) => (
                            <option key={colors} value={colors} >
                                {colors}
                            </option>
                        ))}
                    </select>
                </>
            )}
        </div>
    );
}
