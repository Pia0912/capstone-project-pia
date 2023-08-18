import { useEffect, useState } from "react";
import {Hobby, HobbyWithoutID} from "../models.ts";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {useSuccessMessage} from "./useSuccessMessage.tsx";
import {useErrorMessage} from "./useErrorMessage.ts";

const api = axios.create({
    baseURL: '/api'
});

export default function useHobbies(userId: string | undefined) {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [hobby, setHobby] = useState<Hobby>();

    const navigate = useNavigate();
    const { showSuccessMessage } = useSuccessMessage();
    const { showErrorMessage } = useErrorMessage();

    useEffect(() => {
        if (userId)
            api.get('/hobbies')
                .then((response) => response.data)
                .catch(error => {
                    console.error("Error fetching Hobbies:", error);
                })
                .then((data) => {
                    setHobbies(data)
                    setHobby(undefined)
                });
    }, [userId]);

    function handleAddHobby(data: HobbyWithoutID) {
        api
            .post('/hobbies', data)
            .then((response) => response.data)
            .catch(error => {
                console.error("Error adding Hobbies:", error);
                showErrorMessage("An error occurred, please reload page");
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
            .catch(error => {
                console.error("Error editing Hobby Name:", error);
                showErrorMessage("An error occurred, please reload page");
            })
            .then(data => {
                setHobbies(prevHobbies => {
                    return prevHobbies.map(hobby => (hobby.hobbyId === id ? data : hobby));
                });
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
            .catch((error) => {
                console.error("Error editing Hobby color:", error);
                showErrorMessage("An error occurred, please reload page");
            })
            .then(data => {
                setHobbies(prevHobbies => {
                    return prevHobbies.map(hobby => (hobby.hobbyId === id ? data : hobby));
                });
            });
    }

    function handleDeleteHobby(id: string) {
        api
            .delete(`hobbies/${id}`)
            .catch((error) => {
                console.error("Error deleting Hobby color:", error);
                showErrorMessage("An error occurred, please reload page");
            })
        setHobbies(hobbies.filter(hobby => hobby.hobbyId !== id))
        showSuccessMessage("Hobby deleted successfully!");
        navigate("/hobbies")
    }

    function getHobbyById(hobbyId: string) {
        api.get(`hobbies/hobby/${hobbyId}`)
            .then((response) => {
                const hobbyData = response.data;
                console.log(hobbyData)
                setHobby(hobbyData);
            })
            .catch((error) => {
                console.error("Error get Hobby by Id:", error);
                showErrorMessage("An error occurred, please reload page");
            });
    }

    return { hobbies, handleAddHobby, handleEditHobbyName, handleEditHobbyColor, handleDeleteHobby, getHobbyById, hobby };
}
