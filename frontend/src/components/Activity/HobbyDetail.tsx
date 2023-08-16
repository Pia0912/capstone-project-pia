import {Grid, Button, Snackbar} from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import styled from "@emotion/styled";
import useActivities from "../../hooks/useActivities.ts";
import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import ActivityList from "./ActivityList.tsx";
import {useSuccessMessage} from "../../hooks/useSuccessMessage.tsx";
import {Hobby} from "../../models.ts";

type Props = {
    colors: string[];
    hobby: Hobby | undefined;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function HobbyDetail(props: Props) {
    const navigate = useNavigate();
    const { hobbyId } = useParams();
    const { data, activities, handleEditActivity, handleDeleteActivity, fetchActivitiesData} = useActivities();
    const { successMessage, clearSuccessMessage } = useSuccessMessage();

    React.useEffect(() => {
        if (hobbyId) {
            fetchActivitiesData(hobbyId);
        }
    }, [fetchActivitiesData, hobbyId]);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="div-header" style={{ backgroundColor: data.hobby.color }}>
                {data.hobby.name}
            </div>
            <div className="div-hobbyDetail-buttons">
            <StyledButtonBack
                variant="contained"
                disableElevation
                onClick={() => navigate("/hobbies")}
            >
                Back
            </StyledButtonBack>
            <StyledButtonAdd
                variant="contained"
                disableElevation
                onClick={() => navigate(`/hobby/${data.hobby.hobbyId}/activities/add`)}
            >
                +
            </StyledButtonAdd>
            </div>
            <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={clearSuccessMessage}>
            <StyledAlert onClose={clearSuccessMessage} severity="success">
                {successMessage}
            </StyledAlert>
        </Snackbar>
            <StyledGrid container spacing={2}>
                <ActivityList
                    activities={activities}
                    hobby={data.hobby}
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
  &:hover {
    background-color: darkred;
  }
`;

const StyledButtonAdd = styled(Button)`
  height: 3rem;
  width: 3rem;
  background-color: black;
  font-size: 25px;
  &:hover {
    background-color: darkorange;
  }
`;

const StyledAlert = styled(Alert)`
  width: 360px;
`;

const StyledGrid = styled(Grid)`
  padding: 0;
  margin:0;
  justify-content: center;
  align-items: flex-start;
`;
