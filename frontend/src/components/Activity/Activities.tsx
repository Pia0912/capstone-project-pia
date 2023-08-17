import ActivityListItem from "./ActivityListItem.tsx";
import React from "react";
import useActivities from "../../hooks/useActivities.ts";

export default function Activities() {

    const {activityList, getActivityList} = useActivities();

    React.useEffect(() => {
            getActivityList();

    }, []);

    if (!Array.isArray(activityList)) {
        return <div>Loading activities...</div>;
    }

    return (
        <div className="div-activityList">
            {activityList.map((activity) => (
                <ActivityListItem
                    key={activity.activityId}
                    activity={activity}
                />
            ))}
        </div>
    );
}
