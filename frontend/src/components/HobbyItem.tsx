import {ChangeEvent, ChangeEventHandler, useEffect, useState} from "react";
import {Hobby} from "../models";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styled from "@emotion/styled";
import InfoIcon from '@mui/icons-material/Info';
import {useNavigate} from "react-router-dom";



type Props = {
    hobby: Hobby;
    colors: string[];
    onEditHobby: (hobbyId: string, newName: string) => void;
    onDeleteHobby: (hobbyId: string) => void;
};

export default function HobbyItem(props: Props) {
    const [selectedColor, setSelectedColor] = useState<string>(() => (localStorage.getItem(props.hobby.id) as string) || "");
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(props.hobby.name);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
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

    const handleDeleteClick = () => {
        props.onDeleteHobby(props.hobby.id);
    };

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <div className="div-item" style={{ backgroundColor: selectedColor }}>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={editedName}
                            onChange={handleInputChange}
                        />
                        <StyledButton variant="outlined" onClick={handleSaveClick}>
                            Save
                        </StyledButton>
                    </>
                ) : (
                    <>
                        <div className="div-edit">
                            <h3>{props.hobby.name}</h3>
                            <div className="div-icons">
                                <StyledIconButton
                                    aria-label="edit hobby"
                                    onClick={handleEditClick}
                                >
                                    <EditIcon fontSize="small" />
                                </StyledIconButton>
                                <StyledIconButton
                                    aria-label="delete hobby"
                                    onClick={handleClickOpen}
                                >
                                    <DeleteIcon fontSize="small" />
                                </StyledIconButton>
                                <StyledIconButton
                                    aria-label="show activities"
                                    onClick={() =>
                                        navigate(`/${props.hobby.id}/activities`, { state: { selectedColor } })
                                    }
                                >
                                    <InfoIcon fontSize="small" />
                                </StyledIconButton>
                            </div>
                        </div>
                        <select value={selectedColor} onChange={handleColorChange}>
                            {props.colors.map((colors) => (
                                <option key={colors} value={colors}>
                                    {colors}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </div>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>{"You want to delete your Hobby?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ... are you sure?
                    </DialogContentText>
                </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>No</Button>
                        <Button
                            onClick={handleDeleteClick}
                            color="error"
                            variant="outlined"
                        >
                            Delete hobby
                        </Button>
                    </DialogActions>
            </Dialog>
        </>
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
  transform: translateY(-3rem);
  margin-left: 4px;
`;
