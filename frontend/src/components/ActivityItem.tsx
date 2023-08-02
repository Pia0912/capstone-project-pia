import { ChangeEvent, useEffect, useState } from "react";
import { Grid, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { Activity, ActivityWithoutID, Hobby } from "../models";
import StarRating, { LOCAL_STORAGE_KEY } from "./StarRating";
import useColors from "../hooks/useColors.ts";

type Props = {
    activity?: Activity;
    hobby?: Hobby;
    onEditActivity: (hobbyId: string, activityId: string, updatedActivity: ActivityWithoutID) => void;
    colors: string[];
};

export default function ActivityItem(props: Props) {
    const [lastSelectedRating, setLastSelectedRating] = useState(() => {
        const storedRating = localStorage.getItem(`${props.activity?.activityId}_${LOCAL_STORAGE_KEY}`);
        return storedRating ? parseInt(storedRating, 10) : props.activity?.rating || 5;
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editedActivity, setEditedActivity] = useState({
        name: props.activity?.name || "",
        date: props.activity?.date ? new Date(props.activity.date) : undefined,
    });
    const [selectedColor, setSelectedColor] = useState<string>("");
    const navigate = useNavigate();

    const handleRatingChange = (newRating: number) => {
        console.log("New rating:", newRating);
        setLastSelectedRating(newRating);
        localStorage.setItem(`${props.activity?.activityId}_${LOCAL_STORAGE_KEY}`, newRating.toString());
    };

    const activityId = props.activity?.activityId;

    const handleEditClick = () => {
        setIsEditing(true);
        setLastSelectedRating(props.activity?.rating || 5);
    };

    const handleSaveClick = () => {
        const updatedActivity: ActivityWithoutID = {
            name: editedActivity.name,
            date: editedActivity.date instanceof Date ? editedActivity.date : undefined,
            rating: lastSelectedRating,
            hobbyId: props.hobby?.id || "",
        };

        props.onEditActivity(props.hobby?.id || "", activityId || "", updatedActivity);
        setIsEditing(false);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditedActivity((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const backgroundColor = useColors(props.hobby?.id || "");

    useEffect(() => {
        setSelectedColor(backgroundColor || "");
    }, [backgroundColor]);


    return (
        <Grid item xs={6} sm={6} md={6} lg={6} container justifyContent="center" alignItems="center">
            <div className={`flip-card${isEditing ? " no-flip" : ""}`} style={{ backgroundColor: selectedColor }}>
                <div className="flip-card-inner">
                    <div className="flip-card-front" style={{ backgroundColor: selectedColor }}>
                        {!isEditing ? (
                            <>
                                <h3>{props.activity?.name}</h3>
                                {props.activity?.date ? <p>{new Date(props.activity.date).toLocaleDateString()}</p> : null}
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    name="activityName"
                                    value={editedActivity.name}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="date"
                                    name="activityDate"
                                    value={editedActivity.date ? editedActivity.date.toISOString().slice(0, 10) : ""}
                                    onChange={handleInputChange}
                                />
                            </>
                        )}
                    </div>
                    <div className="flip-card-back">
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
                    <StyledButtonBack variant="outlined" onClick={() => navigate(`/${props.hobby?.id}/activities`)}>
                        Cancel
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
