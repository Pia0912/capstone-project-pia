import { useState } from "react";
import { Activity } from "../../models.ts";
import StarRating from "./StarRating.tsx";
import styled from "@emotion/styled";
import {Grid} from "@mui/material";

type Props = {
    activity?: Activity;
};

export default function ActivityListItem(props: Props) {
    const initialRating = props.activity ? props.activity.rating : 5;
    const [lastSelectedRating, setLastSelectedRating] = useState(initialRating);
    const [isFlipped, setIsFlipped] = useState(false);

    const color = props.activity?.color;

    const handleRatingChange = (newRating: number) => {
        setLastSelectedRating(newRating);
    };

    const activityId = props.activity?.activityId as string;

    const handleCardClick = () => {
        setIsFlipped((prev) => !prev);
    };


    return (
        <>
        <StyledGrid item xs={6} sm={6} md={6} lg={6} container>
            <div className="flip-card" style={{ backgroundColor: color }}>
                <div className={isFlipped ? "flip-card-inner flipped" : "flip-card-inner"}>
                    <div className="flip-card-front" style={{ backgroundColor: color }} onClick={handleCardClick}>
                        <h3>{props.activity?.name}</h3>
                        <p>
                            {props.activity?.activityDate
                                ? new Date(props.activity.activityDate).toLocaleDateString("de-DE")
                                : ""}
                        </p>
                    </div>
                    <div className="flip-card-back" onClick={handleCardClick}>
                        <p>RATING: </p>
                        {activityId && (
                            <StarRating
                                activityId={activityId}
                                initialRating={lastSelectedRating}
                                onChange={handleRatingChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </StyledGrid>
        </>
    );
}

const StyledGrid = styled(Grid)`
  padding: 0;
  margin: 0;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;
