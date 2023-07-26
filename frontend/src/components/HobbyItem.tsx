import {ChangeEvent, ChangeEventHandler, useEffect, useState} from "react";
import {Hobby} from "../models";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import styled from "@emotion/styled";

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
        <div className="div-item" style={{ backgroundColor: selectedColor}}>
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editedName}
                        onChange={handleInputChange}
                    />
                    <StyledButton variant="outlined" onClick={handleSaveClick} >
                        Save
                    </StyledButton>
                </>
            ) : (
                <>
                    <div className="div-edit">
                        <h3>{props.hobby.name}</h3>
                        <StyledIconButton aria-label="edit hobby" onClick={handleEditClick} >
                            <EditIcon fontSize="small" />
                        </StyledIconButton>
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


const StyledButton = styled(Button)`
  border-color: black;
  color: black;
`;

const StyledIconButton = styled(IconButton)`
  padding: 0;
  width: 32px;
  height: 32px;
  transform: translateY(-4px);
`;