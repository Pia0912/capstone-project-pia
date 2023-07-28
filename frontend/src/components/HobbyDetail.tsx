import { useLocation, useNavigate } from "react-router-dom";
import ActivityItem from "./ActivityItem";
import { Button, Grid } from "@mui/material";
import styled from "@emotion/styled";
import useActivities from "../hooks/useActivities.ts";
import { Activity } from "../models.ts";

export default function HobbyDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedColor = location.state?.selectedColor || "#f2f2f1";

    const activitiesResult = useActivities();

    if (activitiesResult === "loading") {
        return <>Loading...</>;
    } else if (activitiesResult === "no hobby") {
        return <div>No Hobby</div>;
    }

    const { hobby, activities } = activitiesResult;

    if (activities === undefined) {
        return <>Activities data is undefined</>;
    }
    const loadActivities = () => {
        if (activities === null) {
            return <>Loading...</>;
        } else if (activities.length === 0) {
            return <div className="div-header">Please add some activities</div>;
        } else {
            return activities.map((activity: Activity) => (
                <ActivityItem key={activity.id} activity={activity} />
            ));
        }
    };

    return (
        <>
            <div className="div-header" style={{ backgroundColor: selectedColor }}>
                {hobby.name}
            </div>
            <Grid container spacing={2}>
                {loadActivities()}
            </Grid>
            <StyledButtonBack
                variant="contained"
                disableElevation
                onClick={() => navigate("/")}
            >
                Back to List
            </StyledButtonBack>
        </>
    );
}

const StyledButtonBack = styled(Button)`
  margin-top: 1rem;
  width: 9rem;
  background-color: black;
`;
