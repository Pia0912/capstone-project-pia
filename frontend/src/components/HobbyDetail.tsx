import {Grid, Button, Snackbar} from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import styled from "@emotion/styled";
import useActivities from "../hooks/useActivities.ts";
import React from "react";
import { useNavigate } from "react-router-dom";
import ActivityList from "./Activity/ActivityList.tsx";
import useHobbies from "../hooks/useHobbies.ts";
import {useSuccessMessage} from "./SuccessMessages.tsx";

type Props = {
    colors: string[];
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function HobbyDetail(props: Props) {
    const navigate = useNavigate();
    const { handleEditActivity, handleDeleteActivity } = useHobbies();
    const data = useActivities();
    const { successMessage, clearSuccessMessage } = useSuccessMessage();

    if (!data?.hobby) {
        return <div>Loading...</div>;
    }

    const { hobby, activities } = data;


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
            <StyledButtonAdd
                variant="contained"
                disableElevation
                onClick={() => navigate(`/${hobby.id}/activities/add`)}
            >
                +
            </StyledButtonAdd>
            </div>
            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={clearSuccessMessage}>
            <StyledAlert onClose={clearSuccessMessage} severity="success">
                {successMessage}
            </StyledAlert>
        </Snackbar>
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

const StyledAlert = styled(Alert)`
  background-color: darkorange;
  color: black;
  width: 100%;
`;

const StyledGrid = styled(Grid)`
  padding: 0;
  margin:0;
  justify-content: center;
  align-items: flex-start;
`;
