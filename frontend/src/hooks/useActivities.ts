import {useCallback, useState} from "react";
import { Activity, ActivityWithoutID, Hobby } from "../models.ts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useSuccessMessage} from "./useSuccessMessage.tsx";
import {useErrorMessage} from "./useErrorMessage.ts";

type ActivitiesData = { hobby: Hobby; activities: Activity[] };
const api = axios.create({
    baseURL: "/api",
});

export default function useActivities(){
    const [data, setData] = useState<ActivitiesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activity, setActivity] = useState<Activity>();
    const [activityList, setActivityList] = useState<Activity[]>([]);

    const navigate = useNavigate();
    const { showSuccessMessage } = useSuccessMessage();
    const { showErrorMessage } = useErrorMessage();

    const fetchActivitiesData = useCallback((hobbyId: string) => {
        setLoading(true);

        api.get(`/hobbies/hobby/${hobbyId}`)
            .then((response) => {
                const hobbyData = response.data;
                api.get(`/hobbies/hobby/${hobbyId}/activities`)
                    .then((activitiesResponse) => {
                        const activitiesData = activitiesResponse.data;
                        setActivities(activitiesData);
                        setData({ hobby: hobbyData, activities: activitiesData.activities });
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("Error fetching activities:", error);
                        showErrorMessage("An error occurred, please reload page");
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.error("Error fetching activities:", error);
                showErrorMessage("An error occurred, please reload page");
                setData(null);
                setLoading(false);
            });
    }, []);

    function handleAddActivityToHobby (hobbyId: string, activityData: ActivityWithoutID) {
        api.post(`/hobbies/hobby/${hobbyId}/activities`, activityData)
            .then((response) => {
                const newActivity: Activity = { ...response.data, hobbyId };
                setActivities((prevActivities) => [...prevActivities, newActivity]);

                setData((prevData) => prevData ? {
                    ...prevData,
                    activities: [...prevData.activities, newActivity],
                } : prevData);

                showSuccessMessage("Activity added successfully!");
            })
            .catch((error) => {
                console.error("Error adding activity:", error);
                showErrorMessage("An error occurred, please reload page");
            });
    }

    function handleEditActivity(hobbyId: string, activityId: string, newName: string, newDate: string, newRating: number, color: string) {
        const updatedActivity: ActivityWithoutID = {
            name: newName,
            activityDate: newDate,
            rating: newRating,
            hobbyId: hobbyId,
            color: color,
        }
        api.put(`/hobbies/hobby/${hobbyId}/activities/${activityId}`, updatedActivity)
            .then((response) => {
                const updatedActivity: Activity = { ...response.data, hobbyId };

                setActivities((prevActivities) =>
                    prevActivities.map((activity) =>
                        activity.activityId === activityId ? updatedActivity : activity
                    )
                );

                showSuccessMessage("Activity edited successfully!");
            })
            .catch((error) => {
                console.error("Error editing activity:", error);
                showErrorMessage("An error occurred, please reload page");
            });
    }

    function handleDeleteActivity (hobbyId: string, activityId: string)  {
        api.delete(`/hobbies/hobby/${hobbyId}/activities/${activityId}`)
            .then(() => {

                setActivities((prevActivities) => prevActivities.filter((activity) => activity.activityId !== activityId));

                showSuccessMessage("Activity deleted successfully!");
                navigate(`/hobby/${hobbyId}/activities`);
            })
            .catch((error) => {
                console.error("Error deleting activity:", error);
                showErrorMessage("An error occurred, please reload page");
            });
    }

    function getActivityById(hobbyId: string, activityId: string ) {
        api.get(`/hobbies/hobby/${hobbyId}/activities/${activityId}`)
            .then((response) => {
                const activityData = response.data;
                setActivity(activityData);
            })
            .catch((error) => {
                console.error("Error get activity by Id:", error);
                showErrorMessage("An error occurred, please reload page");
            });
    }

    function getActivityList() {
        setLoading(true);

        api.get(`/activities`)
            .then((response) => {
                const activitiesData = response.data;

                const fetchHobbyPromises = activitiesData.map((activity: Activity) =>
                    api.get(`/hobbies/hobby/${activity.hobbyId}`)
                );

                Promise.all(fetchHobbyPromises)
                    .then((hobbyResponses) => {
                        const activityListWithColors = activitiesData.map((activity: Activity, index: number) => ({
                            ...activity,
                            color: hobbyResponses[index].data.color,
                        }));

                        setActivityList(activityListWithColors);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("Error get activity List:", error);
                        showErrorMessage("An error occurred, please reload page");
                        setActivityList([]);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.error("Error get activity List:", error);
                showErrorMessage("An error occurred, please reload page");
                setActivityList([]);
                setLoading(false);
            });
    }


    return {
        loading,
        data,
        activities,
        handleAddActivityToHobby,
        handleEditActivity,
        handleDeleteActivity,
        fetchActivitiesData,
        activity,
        getActivityById,
        activityList,
        getActivityList
    };
}
