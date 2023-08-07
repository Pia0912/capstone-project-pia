import { useEffect, useState } from "react";
import {Activity, ActivityWithoutID, Hobby, HobbyWithoutID} from "../models.ts";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: '/api'
});

export default function useHobbies() {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [activities, setActivities] = useState<ActivityWithoutID[]>([]);

    const navigate = useNavigate();

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
                navigate('/');
            });
    }

    function handleEditHobby(id: string, newName: string) {
        const updatedHobby: HobbyWithoutID = {
            name: newName,
        };
        api
            .put(`/hobbies/${id}`, updatedHobby)
            .then(response => response.data)
            .catch(error => console.error(error))
            .then(data => {
                setHobbies(
                    hobbies.map(hobby => {
                        if (hobby.id === id) {
                            return data;
                        }
                        return hobby;
                    })
                );
            });
        navigate(`/`);
    }

    function handleDeleteHobby(id: string) {
        api
            .delete(`hobbies/${id}`)
            .catch(console.error);
        setHobbies(hobbies.filter(hobby => hobby.id !== id))
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
                        if (hobby.id === hobbyId) {
                            return { ...hobby, activities: [...hobby.activities, newActivity] };
                        }
                        return hobby;
                    })
                );

                setActivities((prevActivities) => [...prevActivities, activity]);
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
                        hobby.id === hobbyId
                            ? {
                                ...hobby,
                                activities: hobby.activities.map((activity) =>
                                    activity.activityId === activityId ? { ...data, hobbyId } : activity
                                ),
                            }
                            : hobby
                    )
                );
                navigate(`/${hobbyId}/activities`);
            });
    }

    function handleDeleteActivity(hobbyId: string, activityId: string) {
        api.delete(`/hobbies/${hobbyId}/activities/${activityId}`)
            .catch(console.error)
            .then(() => {
                setHobbies((prevHobbies) =>
                    prevHobbies.map((hobby) => {
                        if (hobby.id === hobbyId) {
                            return {
                                ...hobby,
                                activities: hobby.activities.filter((activity) => activity.activityId !== activityId),
                            };
                        }
                        return hobby;
                    })
                );
                navigate(`/${hobbyId}/activities`);
            });
    }

    return { hobbies, handleAddHobby, handleEditHobby, handleDeleteHobby, handleAddActivity, handleEditActivity, handleDeleteActivity, activities };
}
