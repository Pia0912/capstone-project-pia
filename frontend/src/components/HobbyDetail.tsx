import { Grid, Button } from "@mui/material";
import styled from "@emotion/styled";
import useActivities from "../hooks/useActivities.ts";

import { useNavigate } from "react-router-dom";
import ActivityList from "./Activity/ActivityList.tsx";
import useHobbies from "../hooks/useHobbies.ts";
import CachedIcon from '@mui/icons-material/Cached';

type Props = {
    colors: string[];
};

export default function HobbyDetail(props: Props) {
    const navigate = useNavigate();
    const { handleEditActivity, handleDeleteActivity } = useHobbies();
    const data = useActivities();


    if (!data?.hobby) {
        return <div>Loading...</div>;
    }

    const { hobby, activities } = data;

    const handleReload = () => {
        window.location.href = window.location.pathname + "?timestamp=" + Date.now();
    };


    return (
        <>
            <div className="div-header" style={{ backgroundColor: hobby.color }}>
                {hobby.name}
            </div>
            <div className="div-hobbyDetail-buttons">
            <StyledButtonBack
                variant="contained"
                disableElevation
                onClick={() => navigate("/")}
            >
                Back
            </StyledButtonBack>
                <StyledButtonReload
                    variant="contained"
                    disableElevation
                    onClick={handleReload}
                >
                   <CachedIcon/>
                </StyledButtonReload>
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

const StyledButtonReload = styled(Button)`
  height: 3rem;
  width: 3rem;
  background-color: black;
  color: white;
  font-size: 25px;
`;

const StyledGrid = styled(Grid)`
  padding: 0;
  margin:0;
  justify-content: center;
  align-items: flex-start;
`;
