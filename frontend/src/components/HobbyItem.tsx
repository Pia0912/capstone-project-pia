import {ChangeEvent, ChangeEventHandler, useState} from "react";
import {Hobby} from "../models";
import {Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styled from "@emotion/styled";
import InfoIcon from '@mui/icons-material/Info';
import {useNavigate} from "react-router-dom";
import useColors from "../hooks/useColors.ts";



type Props = {
    hobby: Hobby;
    colors: string[];
    onEditHobby: (hobbyId: string, newName: string, newColor: string) => void;
    onDeleteHobby: (hobbyId: string) => void;
};

export default function HobbyItem(props: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(props.hobby.name);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const [color, setColor] = useColors(props.hobby.id);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        props.onEditHobby(props.hobby.id, editedName, color);
        setIsEditing(false);
    };

    const handleEditBack = () => {
        setIsEditing(false);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditedName(event.target.value);
    };

    const handleColorChange: ChangeEventHandler<HTMLSelectElement> = (event: ChangeEvent<HTMLSelectElement>) => {
        const newColor = event.target.value;
        setColor(newColor);
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
            <div className="div-item" style={{ backgroundColor: color }}>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={editedName}
                            onChange={handleInputChange}
                        />
                        <DivContainer>
                            <StyledButtonBack variant="outlined" onClick={handleEditBack}>
                                Back
                            </StyledButtonBack>
                            <StyledButton variant="outlined" onClick={handleSaveClick}>
                                Save
                            </StyledButton>
                        </DivContainer>
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
                                        navigate(`/${props.hobby.id}/activities`, { state: { color: color } })
                                    }
                                >
                                    <InfoIcon fontSize="small" />
                                </StyledIconButton>
                            </div>
                        </div>
                        <select value={color} onChange={handleColorChange}>
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

const DivContainer = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  border-color: black;
  color: black;
  margin: 3px;
  width: 5rem;
`;

const StyledButtonBack = styled(Button)`
  margin: 3px;
  width: 5rem;
  background-color: black;
  color: white;
`;

const StyledIconButton = styled(IconButton)`
  padding: 0;
  width: 32px;
  height: 32px;
  transform: translateY(-3rem);
  margin-left: 4px;
`;
