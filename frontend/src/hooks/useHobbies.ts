import { useEffect, useState } from "react";
import {Activity, ActivityWithoutID, Hobby, HobbyWithoutID} from "../models.ts";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {useSuccessMessage} from "../components/SuccessMessages.tsx";

const api = axios.create({
    baseURL: '/api'
});

export default function useHobbies() {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [activities, setActivities] = useState<ActivityWithoutID[]>([]);

    const navigate = useNavigate();
    const { showSuccessMessage } = useSuccessMessage();

    useEffect(() => {
        api.get('/hobbies')
            .then((response) => response.data)
            .catch(console.error)
            .then((data) => setHobbies(data));
    }, []);

    function handleAddHobby(data: HobbyWithoutID) {
        api
            .post('/hobbies', data)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
            })
            .then((data) => {
                setHobbies((prevHobbies) => [...prevHobbies, data]);
                showSuccessMessage("Hobby added successfully!");
                navigate('/');
            });
    }

    function handleEditHobbyName(id: string, newName: string) {
        const updatedHobby: HobbyWithoutID = {
            name: newName,
            color: '',
        };
        api
            .put(`/hobbies/${id}`, updatedHobby)
            .then(response => response.data)
            .catch(error => console.error(error))
            .then(data => {
                setHobbies(prevHobbies => {
                    return prevHobbies.map(hobby => (hobby.hobbyId === id ? data : hobby));
                });
                console.log("Updated hobby state:", hobbies);
                showSuccessMessage("Hobby name edited successfully!");
            });
        navigate('/');
    }

    function handleEditHobbyColor(id: string, newColor: string) {
        api
            .put(`/hobbies/${id}/color`, null, {
                params: { color: newColor },
            })
            .then(response => response.data)
            .catch(error => console.error(error))
            .then(data => {
                setHobbies(prevHobbies => {
                    return prevHobbies.map(hobby => (hobby.hobbyId === id ? data : hobby));
                });
                console.log("Updated hobby state:", hobbies);
            });
    }

    function handleDeleteHobby(id: string) {
        api
            .delete(`hobbies/${id}`)
            .catch(console.error);
        setHobbies(hobbies.filter(hobby => hobby.hobbyId !== id))
        showSuccessMessage("Hobby deleted successfully!");
        navigate("/")
    }

    function handleAddActivity(hobbyId: string, activity: ActivityWithoutID) {
        api
            .post(`/hobbies/${hobbyId}/activities`, activity)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
            })
            .then((data) => {
                const newActivity: Activity = { ...data, hobbyId };

                setHobbies((prevHobbies) =>
                    prevHobbies.map((hobby) => {
                        if (hobby.hobbyId=== hobbyId) {
                            return { ...hobby, activities: [...hobby.activities, newActivity] };
                        }
                        return hobby;
                    })
                );

                setActivities((prevActivities) => [...prevActivities, activity]);
                showSuccessMessage("Activity added successfully!");
                navigate(`/${hobbyId}/activities`);
            });
    }

    function handleEditActivity(hobbyId: string, activityId: string, newName: string, newDate: string, newRating: number, color: string) {
        const updatedActivity: ActivityWithoutID = {
            name: newName,
            activityDate: newDate,
            rating: newRating,
            hobbyId: hobbyId,
            color: color,
        };

        api.put(`/hobbies/${hobbyId}/activities/${activityId}`, updatedActivity)
            .then((response) => response.data)
            .catch(error => console.error(error))
            .then((data) => {
                setActivities(
                    activities.map((activity) => {
                        if (activity.activityId === activityId)
                            {return data;
                            }
                        return activity;
                    })
                );

                setHobbies((prevHobbies) =>
                    prevHobbies.map((hobby) =>
                        hobby.hobbyId === hobbyId
                            ? {
                                ...hobby,
                                activities: hobby.activities.map((activity) =>
                                    activity.activityId === activityId ? { ...data, hobbyId } : activity
                                ),
                            }
                            : hobby
                    )
                );
                showSuccessMessage("Activity edited successfully!");
                navigate(`/${hobbyId}/activities`);
            });
    }

    function handleDeleteActivity(hobbyId: string, activityId: string) {
        api.delete(`/hobbies/${hobbyId}/activities/${activityId}`)
            .catch(console.error)
            .then(() => {
                setHobbies((prevHobbies) =>
                    prevHobbies.map((hobby) => {
                        if (hobby.hobbyId === hobbyId) {
                            return {
                                ...hobby,
                                activities: hobby.activities.filter((activity) => activity.activityId !== activityId),
                            };
                        }
                        return hobby;
                    })
                );
                showSuccessMessage("Activity deleted successfully!");
                navigate(`/${hobbyId}/activities`);
            });
    }

    return { hobbies, handleAddHobby, handleEditHobbyName, handleEditHobbyColor, handleDeleteHobby, handleAddActivity, handleEditActivity, handleDeleteActivity, activities };
}
