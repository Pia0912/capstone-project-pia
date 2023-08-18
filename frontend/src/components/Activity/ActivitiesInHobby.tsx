import { Grid } from "@mui/material";
import {Hobby, Activity} from "../../models.ts";
import ActivityItem from "./ActivityItem.tsx";

type Props = {
    activities: Activity[] | undefined;
    hobby: Hobby;
    colors: string[];
    onEditActivity: (hobbyId: string, activityId: string, newName: string, newDate: string, newRating: number, color: string) => void;
    onDeleteActivity: (hobbyId: string, activityId: string) => void;
};

export default function ActivitiesInHobby(props: Props) {
    if (!props.activities || props.activities.length === 0) {
        return <p className="noActivities">No activities yet.</p>;
    }

    const handleEditActivity = (
        hobbyId: string,
        activityId: string,
        newName: string,
        newDate: string,
        newRating: number,
        color: string,

    ) => {
        props.onEditActivity(hobbyId, activityId, newName, newDate, newRating, color);
    };


    return (
        <Grid item xs={12} container>
                {props.activities.map((activity) => (
                    <ActivityItem
                        key={activity.activityId}
                        activity={activity}
                        hobby={props.hobby}
                        colors={props.colors}
                        onEditActivity={handleEditActivity}
                        onDeleteActivity={props.onDeleteActivity}
                    />
                ))}
        </Grid>
    );
}
