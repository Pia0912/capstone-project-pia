import { Activity } from "../models";
import { useLocation, useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import { ChangeEvent, useState } from "react";
import { Grid, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import styled from "@emotion/styled";

type Props = {
    activity: Activity;
};

export default function ActivityItem(props: Props) {
    const location = useLocation();
    const selectedColor = location.state?.selectedColor || "#f2f2f2";

    const [lastSelectedRating, setLastSelectedRating] = useState(5);

    const handleRatingChange = (newRating: number) => {
        console.log("New rating:", newRating);
        setLastSelectedRating(newRating);
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editedActivityName, setEditedActivityName] = useState(props.activity.name);

    const navigate = useNavigate();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditedActivityName(event.target.value);
    };

    return (
        <Grid item xs={6} sm={6} md={6} lg={6} container justifyContent="center" alignItems="center">
            <div
                className={`flip-card${isEditing ? " no-flip" : ""}`}
                style={{ backgroundColor: selectedColor }}
            >
                <div className="flip-card-inner">
                    <div className="flip-card-front" style={{ backgroundColor: selectedColor }}>
                        {!isEditing ? (
                            <>
                                <h3>{props.activity.name}</h3>
                                <p>{props.activity.date}</p>
                            </>
                        ) : (
                            <input type="text" value={editedActivityName} onChange={handleInputChange} />
                        )}
                    </div>
                    <div className="flip-card-back">
                        <p>RATING: </p>
                        <StarRating initialRating={lastSelectedRating} onChange={handleRatingChange} />
                    </div>
                </div>
            </div>
            {!isEditing ? (
                <StyledIconButton aria-label="edit activity" onClick={handleEditClick}>
                    <EditIcon fontSize="small" />
                </StyledIconButton>
            ) : (
                <div style={{ margin: "1rem" }}>
                    <StyledButtonBack
                        variant="outlined"
                        onClick={() => navigate(`/${props.activity.hobbyId}/activities`, { state: { selectedColor } })}
                    >
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

// Add custom CSS styles to prevent flipping when the no-flip class is applied
const styles = `
  .flip-card.no-flip .flip-card-inner {
    transform: none !important;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
