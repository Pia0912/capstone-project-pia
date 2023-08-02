import { Grid } from "@mui/material";
import {Hobby, Activity, ActivityWithoutID} from "../models";
import ActivityItem from "./ActivityItem";
import styled from "@emotion/styled";

type Props = {
    activities: Activity[] | undefined;
    hobby: Hobby;
    colors: string[];
    onEditActivity: (hobbyId: string, activityId: string, updatedActivity: ActivityWithoutID) => void;
};

export default function ActivityList(props: Props) {
    if (!props.activities || props.activities.length === 0) {
        return <p>No activities yet.</p>;
    }

    const handleEditActivity = (
        hobbyId: string,
        activityId: string,
        updatedActivity: ActivityWithoutID
    ) => {
        props.onEditActivity(hobbyId, activityId, updatedActivity);
    };


    return (
        <Grid item xs={12} container justifyContent="center" alignItems="center">
            <StyledGrid container justifyContent="center">
                {props.activities.map((activity) => (
                    <ActivityItem
                        key={activity.activityId}
                        activity={activity}
                        hobby={props.hobby}
                        colors={props.colors}
                        onEditActivity={handleEditActivity}
                    />
                ))}
            </StyledGrid>
        </Grid>
    );
}

const StyledGrid = styled(Grid)`
  margin: 2rem;
`;
