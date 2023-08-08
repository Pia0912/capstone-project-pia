import React, { ChangeEvent, useState} from "react";
import {Grid, Button, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import styled from "@emotion/styled";
import { Activity, Hobby } from "../../models.ts";
import StarRating from "./StarRating.tsx";
import {LOCAL_STORAGE_KEY} from "../../constants/starRating.ts";
import DeleteIcon from "@mui/icons-material/Delete";


type Props = {
    activity?: Activity | undefined;
    hobby: Hobby;
    colors: string[];
    onEditActivity: (hobbyId: string, activityId: string, newName: string, newDate: string, newRating: number, color: string) => void;
    onDeleteActivity: (hobbyId: string, activityId: string) => void;
};

export default function ActivityItem(props: Props) {
    const [lastSelectedRating, setLastSelectedRating] = useState(() => {
        const storedRating = localStorage.getItem(
            `${props.activity?.activityId}_${LOCAL_STORAGE_KEY}`
        );
        return storedRating ? parseInt(storedRating, 10) : props.activity?.rating || 5;
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [editedActivity, setEditedActivity] = useState({
        name: props.activity?.name || "",
        date: props.activity?.activityDate || "",
    });

    const color = props.hobby.color;
    const [open, setOpen] = useState(false);

    const handleRatingChange = (newRating: number) => {
        setLastSelectedRating(newRating);
        localStorage.setItem(
            `${props.activity?.activityId}_${LOCAL_STORAGE_KEY}`,
            newRating.toString()
        );
    };

    const activityId = props.activity?.activityId as string;

    const handleDeleteActivity = () => {
        props.onDeleteActivity(props.hobby.id, activityId);
        handleClose();
    };

    const handleCardClick = () => {
        if (!isEditing) {
            setIsFlipped((prev) => !prev);
        }
    };

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsEditing(true);
    };

    const handleEditBack = () => {
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        props.onEditActivity(
            props.hobby?.id || "",
            activityId || "",
            editedActivity.name,
            editedActivity.date,
            lastSelectedRating,
            color
        );
        setIsEditing(false);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditedActivity((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <StyledGrid item xs={6} sm={6} md={6} lg={6} container>
            <div
                className={`flip-card ${isEditing ? "" : isFlipped ? "is-flipped" : ""}`}
                style={{ backgroundColor: color }}
            >
                <div className={`${isEditing ? "card-inner" : "flip-card-inner"}`}>
                    <div className={`flip-card-front card-front ${isEditing ? "hidden" : ""}`}
                         style={{ backgroundColor: color }}
                         onClick={handleCardClick}
                    >
                        {!isEditing ? (
                            <>
                                <h3>{props.activity?.name}</h3>
                                <p>{props.activity?.activityDate
                                        ? new Date(props.activity.activityDate).toLocaleDateString('de-DE')
                                        : ''}
                                </p></>
                        ) : (
                            <>
                                <input
                                    className="input-activity"
                                    type="text"
                                    name="name"
                                    value={editedActivity.name}
                                    onChange={handleInputChange}
                                />
                                <input
                                    className="input-activity"
                                    type="date"
                                    name="date"
                                    value={editedActivity.date}
                                    onChange={handleInputChange}
                                />
                            </>
                        )}
                    </div>
                    <div className="flip-card-back" onClick={handleCardClick}>
                        <p>RATING: </p>
                        {props.activity?.activityId && (
                            <StarRating
                                activityId={props.activity.activityId}
                                initialRating={lastSelectedRating}
                                onChange={handleRatingChange}
                            />
                        )}
                    </div>
                </div>
            </div>
            {!isEditing ? (
                <div className="div-activity">
                    <StyledIconButton aria-label="edit activity" onClick={handleEditClick}>
                        <EditIcon fontSize="small" />
                    </StyledIconButton>
                    <StyledIconButton
                        aria-label="delete activity"
                        onClick={handleClickOpen}
                    >
                        <DeleteIcon fontSize="small" />
                    </StyledIconButton>
                </div>
            ) : (
                <div style={{ margin: "1rem" }}>
                    <StyledButtonBack variant="outlined" onClick={handleEditBack}>
                        Back
                    </StyledButtonBack>
                    <StyledButton variant="outlined" onClick={handleSaveClick}>
                        Save
                    </StyledButton>
                </div>
            )}
            <StyledDialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>{"You want to delete your Activity?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ... are you sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button
                        onClick={handleDeleteActivity}
                        color="error"
                        variant="outlined"
                    >
                        Delete activity
                    </Button>
                </DialogActions>
            </StyledDialog>
        </StyledGrid>

    );
}

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
  margin-left: 1rem;
`;


const StyledGrid = styled(Grid)`
  padding: 0;
  margin:0;
  justify-content: center;
  align-items: flex-start;
`;

const StyledDialog = styled(Dialog)`
  padding: 0;
  margin:0;
  justify-content: center;
  align-items: flex-start;
  height: 80%;
`;
