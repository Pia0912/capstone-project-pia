import { useEffect, useState } from "react";
import {Hobby, HobbyWithoutID} from "../models.ts";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {useSuccessMessage} from "./useSuccessMessage.tsx";

const api = axios.create({
    baseURL: '/api'
});

export default function useHobbies() {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [hobby, setHobby] = useState<Hobby>();

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
                navigate('/hobbies');
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
        navigate('/hobbies');
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
        navigate("/hobbies")
    }

    function getHobbyById(hobbyId: string) {
        api.get(`hobbies/hobby/${hobbyId}`)
            .then((response) => {
                const hobbyData = response.data;
                setHobby(hobbyData);
            })
            .catch(console.error);
    }



    return { hobbies, handleAddHobby, handleEditHobbyName, handleEditHobbyColor, handleDeleteHobby, getHobbyById, hobby };
}
