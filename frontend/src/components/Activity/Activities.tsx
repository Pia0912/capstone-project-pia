import ActivityListItem from "./ActivityListItem.tsx";
import {useEffect, useState} from "react";
import useActivities from "../../hooks/useActivities.ts";
import ActivityFilter, {FilterData} from "./ActivityFilter.tsx";
import {Activity} from "../../models.ts";

export default function Activities() {
    const { activityList, getActivityList } = useActivities();
    const [filteredActivityList, setFilteredActivityList] = useState<Activity[]>([]);

    useEffect(() => {
        getActivityList();
    }, []);

    const handleFilterChange = (filterData: FilterData) => {
        const filteredData = activityList.filter((activity) => {
            const isDateFiltered = filterData.date && activity.activityDate !== filterData.date;
            const isHobbyFiltered = filterData.hobby && activity.hobbyId !== filterData.hobby;
            const isNameFiltered = filterData.search && !activity.name.includes(filterData.search);

            return !(isDateFiltered || isHobbyFiltered || isNameFiltered);
        });

        setFilteredActivityList(filteredData);
    };

    if (!Array.isArray(filteredActivityList)) {
        return <div>Loading activities...</div>;
    }

    return (
        <>
            <ActivityFilter onFilterChange={handleFilterChange} />

            <div className="div-activityList">
                {filteredActivityList.map((activity) => (
                    <ActivityListItem
                        key={activity.activityId}
                        activity={activity}
                    />
                ))}
            </div>
        </>
    );
}
