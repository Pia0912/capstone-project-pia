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

    const { handleEditActivity, handleDeleteActivity } = useHobbies();
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
            <div className="div-hobbyDetail">
            <StyledButtonBack
                variant="contained"
                disableElevation
                onClick={() => navigate("/")}
            >
                Back
            </StyledButtonBack>
            <StyledButtonAdd
                variant="contained"
                disableElevation
                onClick={() => navigate(`/${hobby.id}/activities/add`)}
            >
                +
            </StyledButtonAdd>
            </div>
            <StyledGrid container spacing={2}>
                <ActivityList
                    activities={activities}
                    hobby={hobby}
                    colors={props.colors}
                    onEditActivity={handleEditActivity}
                    onDeleteActivity={handleDeleteActivity}
                />
            </StyledGrid>
        </>
    );
}

const StyledButtonBack = styled(Button)`
  height: 3rem;
  width: 3rem;
  background-color: black;
`;

const StyledButtonAdd = styled(Button)`
  height: 3rem;
  width: 3rem;
  background-color: black;
  font-size: 25px;
`;

const StyledGrid = styled(Grid)`
  padding: 0;
  margin:0;
  justify-content: center;
  align-items: flex-start;
`;