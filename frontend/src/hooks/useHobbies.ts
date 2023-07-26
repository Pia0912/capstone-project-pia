import {useEffect, useState} from "react";
import {Hobby, HobbyWithoutID} from "../models.ts";
import axios from "axios";
import {useNavigate} from 'react-router-dom';

export default function useHobbies(){
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

    return { hobbies, handleAddHobby, handleEditHobby };
}
