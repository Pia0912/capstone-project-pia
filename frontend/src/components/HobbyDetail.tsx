import { useLocation, useNavigate} from "react-router-dom";
import ActivityItem from "./ActivityItem";
import { Button, Grid } from "@mui/material";
import styled from "@emotion/styled";
import useActivities from "../hooks/useActivities.ts";
import { Activity } from "../models.ts";

export default function HobbyDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedColor = location.state?.selectedColor || "#f2f2f1";

    const data = useActivities();

    if (!data || !data.hobby) {
        return <div>Loading...</div>;
    }

    const { hobby, activities } = data;

    const loadActivities = () => {
        if (activities === undefined) {
            return <>Loading...</>;
        } else if (activities.length === 0) {
            return <div className="div-header">Please add some activities</div>;
        } else {
            return activities.map((activity: Activity, index: number) => (
                <ActivityItem key={activity.id || index} activity={activity} />
            ));
        }
    };

    return (
        <>
            <div className="div-header" style={{ backgroundColor: selectedColor }}>
                {hobby.name}
            </div>
            <StyledButtonAdd
                variant="contained"
                disableElevation
                onClick={() => navigate(`/${hobby.id}/activities/add`)}
            >
                +
            </StyledButtonAdd>
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

const StyledButtonAdd = styled(Button)`
  margin: 0 20% 2rem 75%;
  background-color: black;
  font-size: 25px;
`;
