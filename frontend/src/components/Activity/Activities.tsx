import {Activity} from "../../models.ts";
import ActivitiesListItem from "./ActivitiesListItem.tsx";

type Props = {
    activities: Activity[];
}
export default function Activities(props: Props) {
    if (!Array.isArray(props.activities)) {
        return <div>Loading activities...</div>;
    }

    return (
        <div className="div-hobbyList">
            {props.activities.map((activity) => (
                <ActivitiesListItem
                    key={activity.activityId}
                    activity={activity}
                />
            ))}
        </div>
    );
}