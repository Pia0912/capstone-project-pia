import { useEffect, useState } from "react";
import { Activity, ActivityWithoutID, Hobby } from "../models.ts";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import {useSuccessMessage} from "./useSuccessMessage.tsx";

type ActivitiesData = { hobby: Hobby; activities: Activity[] };
const api = axios.create({
    baseURL: "/api",
});

export default function useActivities(hobbyId: string | undefined) {
    const [data, setData] = useState<ActivitiesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<Activity[]>([]);

    const navigate = useNavigate();
    const { showSuccessMessage } = useSuccessMessage();

    useEffect(() => {
        let isMounted = true;

        if (hobbyId) {
            api
                .get(`/hobbies/hobby/${hobbyId}`)
                .then((response) => {
                    const hobbyData = response.data;
                    if (isMounted) {
                        api
                            .get(`/hobbies/hobby/${hobbyId}/activities`)
                            .then((activitiesResponse) => {
                                const activitiesData = activitiesResponse.data;
                                setActivities(activitiesData);
                                setData({ hobby: hobbyData, activities: activitiesData.activities });
                                setLoading(false);
                            })
                            .catch((error) => {
                                console.error(error);
                                setLoading(false);
                            });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    if (isMounted) {
                        setData(null);
                        setLoading(false);
                    }
                });
        }

        return () => {
            isMounted = false;
        };
    }, [hobbyId]);

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
                navigate(`hobby/${hobbyId}/activities`);
            })
            .catch((error) => {
                console.error(error);
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
                console.error(error);
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
                console.error(error);
            });
    }


    return {
        loading,
        data,
        activities,
        handleAddActivityToHobby,
        handleEditActivity,
        handleDeleteActivity,
    };
}
