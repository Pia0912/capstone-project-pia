import { Activity } from "../models";
import { useLocation } from "react-router-dom";
import StarRating from "./StarRating";
import { useState } from "react";
import { Grid } from "@mui/material";

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

    return (
        <>
            <Grid item xs={6} sm={6} md={6} lg={6} container justifyContent="center" alignItems="center">
                <div className="flip-card" style={{ backgroundColor: selectedColor }}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front" style={{ backgroundColor: selectedColor }}>
                            <h3>{props.activity.name}</h3>
                            {props.activity.date ? <p>{new Date(props.activity.date).toLocaleDateString()}</p> : null}
                        </div>
                        <div className="flip-card-back">
                            <p>RATING: </p>
                            <StarRating initialRating={lastSelectedRating} onChange={handleRatingChange} />
                        </div>
                    </div>
                </div>
            </Grid>
        </>
    );
}
