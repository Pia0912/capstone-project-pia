import { ChangeEvent, useState} from "react";
import { Grid, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import styled from "@emotion/styled";
import { Activity, ActivityWithoutID, Hobby } from "../models";
import StarRating from "./StarRating";
import useColors from "../hooks/useColors.ts";
import {LOCAL_STORAGE_KEY} from "../constants/starRating.ts";

type Props = {
    activity?: Activity | undefined;
    hobby: Hobby;
    onEditActivity: (hobbyId: string, activityId: string, updatedActivity: ActivityWithoutID) => void;
    colors: string[];
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
        date: props.activity?.date ? new Date(props.activity.date) : undefined,
    });

    const hobbyId = props.hobby.id;
    const [color] = useColors(hobbyId);

    const handleRatingChange = (newRating: number) => {
        console.log("New rating:", newRating);
        setLastSelectedRating(newRating);
        localStorage.setItem(
            `${props.activity?.activityId}_${LOCAL_STORAGE_KEY}`,
            newRating.toString()
        );
    };

    const activityId = props.activity?.activityId;

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
        const updatedActivity: ActivityWithoutID = {
            name: editedActivity.name,
            date: editedActivity.date,
            rating: lastSelectedRating,
            hobbyId: props.hobby?.id || "",
        };

        props.onEditActivity(
            props.hobby?.id || "",
            activityId || "",
            updatedActivity
        );

        setIsEditing(false);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setEditedActivity((prev) => ({
            ...prev,
            [name]: name === "date" ? new Date(value) : value,
        }));
    };


    return (
        <Grid item xs={6} sm={6} md={6} lg={6} container justifyContent="center" alignItems="flex-start">
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
                                {props.activity?.date ? (
                                    <p>{new Date(props.activity.date).toLocaleDateString()}</p>
                                ) : null}
                            </>
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
                                    value={editedActivity.date ? editedActivity.date.toISOString().slice(0, 10) : ""}
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
                <div style={{ margin: "1rem" }}>
                    <StyledIconButton aria-label="edit activity" onClick={handleEditClick}>
                        <EditIcon fontSize="small" />
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
        </Grid>
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
