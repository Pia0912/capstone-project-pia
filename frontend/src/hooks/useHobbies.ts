import { useEffect, useState } from "react";
import {Activity, ActivityWithoutID, Hobby, HobbyWithoutID} from "../models.ts";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function useHobbies() {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get('api/hobbies')
            .then((response) => response.data)
            .catch(console.error)
            .then((data) => setHobbies(data));
    }, []);

    function handleAddHobby(data: HobbyWithoutID) {
        axios
            .post('api/hobbies', data)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
            })
            .then((data) => {
                setHobbies(data);
            });
        navigate('/');
    }

    function handleEditHobby(id: string, newName: string) {
        const updatedHobby: HobbyWithoutID = {
            name: newName,
        };
        axios.put(`/api/hobbies/${id}`, updatedHobby)
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
        axios.delete(`/api/hobbies/${id}`)
            .catch(console.error);
        setHobbies(hobbies.filter(hobby => hobby.id !== id))
        navigate("/")
    }

    function handleAddActivity(hobbyId: string, activity: ActivityWithoutID) {
        axios
            .post(`/api/hobbies/${hobbyId}/activities`, activity)
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
            });
    }
    function handleEditActivity(hobbyId: string, activityId: string, updatedActivity: ActivityWithoutID) {
        axios.put(`/api/hobbies/${hobbyId}/activities/${activityId}`, updatedActivity)
            .then(response => response.data)
            .catch(error => console.error(error))
            .then(data => {
                setHobbies((prevHobbies) =>
                    prevHobbies.map((hobby) => {
                        if (hobby.id === hobbyId) {
                            return {
                                ...hobby,
                                activities: hobby.activities.map((activity) =>
                                    activity.id === activityId ? { ...data, hobbyId: hobbyId } : activity
                                ),
                            };
                        }
                        return hobby;
                    })
                );
            });
    }

    return { hobbies, handleAddHobby, handleEditHobby, handleDeleteHobby, handleAddActivity, handleEditActivity };
}
