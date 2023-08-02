import { Grid, Button } from "@mui/material";
import styled from "@emotion/styled";
import useActivities from "../hooks/useActivities.ts";

import { useLocation, useNavigate } from "react-router-dom";
import ActivityList from "./ActivityList.tsx";
import useHobbies from "../hooks/useHobbies.ts";
import useColors from "../hooks/useColors.ts";

type Props = {
    colors: string[];
};

export default function HobbyDetail(props: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedColor = location.state?.color || props.colors[0];

    const { handleEditActivity } = useHobbies();
    const data = useActivities();

    const [color] = useColors(data?.hobby?.id || "");

    if (!data || !data.hobby) {
        return <div>Loading...</div>;
    }

    const { hobby, activities } = data;

    return (
        <>
            <div className="div-header" style={{ backgroundColor: color || selectedColor }}>
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
                <ActivityList
                    activities={activities}
                    hobby={hobby}
                    colors={props.colors}
                    onEditActivity={handleEditActivity}
                />
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
