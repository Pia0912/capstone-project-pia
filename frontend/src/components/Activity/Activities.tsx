import ActivityListItem from "./ActivityListItem.tsx";
import { useEffect, useState } from "react";
import useActivities from "../../hooks/useActivities.ts";
import ActivityFilter, { FilterData } from "./ActivityFilter.tsx";
import { Activity } from "../../models.ts";

export default function Activities() {
    const { activityList, getActivityList } = useActivities();
    const [filteredActivityList, setFilteredActivityList] = useState<Activity[]>([]);
    const [filter, setFilter] = useState<FilterData>({
        date: "",
        hobby: "",
        search: "",
    });

    useEffect(() => {
        getActivityList();
    }, []);

    useEffect(() => {
        const filteredData = activityList.filter((activity) => {
            const isDateFiltered = filter.date && activity.activityDate !== filter.date;
            const isHobbyFiltered = filter.hobby && activity.hobbyId !== filter.hobby;
            const isNameFiltered = filter.search && !activity.name.includes(filter.search);

            return !(isDateFiltered || isHobbyFiltered || isNameFiltered);
        });

        setFilteredActivityList(filteredData);
    }, [activityList, filter]);

    const handleFilterChange = (newFilter: FilterData) => {
        setFilter(newFilter);
    };

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
