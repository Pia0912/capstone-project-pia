import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { ActivityWithoutID, Hobby } from '../../models';
import { Container, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import styled from '@emotion/styled';

import useHobbies from "../../hooks/useHobbies.ts";
import {useSuccessMessage} from "../SuccessMessages.tsx";




type Props = {
    hobbies: Hobby[];
    onAddActivity: (hobbyId: string, activity: ActivityWithoutID) => void;
};

export default function CalendarActivityAddForm(props: Props) {
    const [name, setName] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [rating, setRating] = useState<number>(5);
    const [selectedHobbyId, setSelectedHobbyId] = useState<string>('');

    const navigate = useNavigate();
    const { showSuccessMessage } = useSuccessMessage();
    const { handleAddActivity } = useHobbies();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedHobbyId) {
            console.error('Hobby ID is undefined!');
            return;
        }

        const newActivity: ActivityWithoutID = {
            name: name,
            activityDate: date,
            rating: rating,
            hobbyId: selectedHobbyId,
            color: '',
        };

        handleAddActivity(selectedHobbyId, newActivity);
        setName('');
        setDate('');
        setRating(5);
        setSelectedHobbyId('');
        showSuccessMessage('Activity added successfully!');
        navigate('/');
    };

    const handleAddNewHobby = () => {
        navigate('/add');
    };

    return (
        <StyledContainer>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Add new Activity</legend>
                    <FormControl>
                        <InputLabel>Select a hobby</InputLabel>
                        <StyledSelect
                            value={selectedHobbyId}
                            onChange={(event) => setSelectedHobbyId(event.target.value as string)}
                            required
                        >
                            <StyledMenuItem value="add-hobby" onClick={handleAddNewHobby}>
                                + Add New Hobby
                            </StyledMenuItem>
                            {props.hobbies.map((hobby) => (
                                <MenuItem key={hobby.id} value={hobby.id}>
                                    {hobby.name}
                                </MenuItem>
                            ))}
                        </StyledSelect>
                    </FormControl>
                    <label htmlFor="name">Name: </label>
                    <input
                        onChange={(event) => setName(event.target.value)}
                        value={name}
                        name="name"
                        id="name"
                        type="text"
                        required
                        className="input-add"
                    />
                    <label htmlFor="name">Date: </label>
                    <input
                        onChange={(event) => setDate(event.target.value)}
                        value={date}
                        name="date"
                        id="date"
                        type="date"
                        required
                        className="input-add"
                    />
                </fieldset>
                <StyledButtonSubmit type="submit" variant="contained">
                    Submit
                </StyledButtonSubmit>
            </form>
            <StyledButtonBack variant="outlined" disableElevation onClick={() => navigate(`/`)} >
                Back to Calendar
            </StyledButtonBack>
        </StyledContainer>
    );
}

const StyledContainer = styled(Container)`
  background-color: coral;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 3rem;
  padding-bottom: 8rem;
`;

const StyledSelect= styled(Select)`
  width: 350px;
  height: 90px;
  border: 1px solid black;
  justify-content: center;
`;

const StyledButtonSubmit = styled(Button)`
  width: 9rem;
  background-color: black;
`;

const StyledButtonBack = styled(Button)`
  margin-top: 1rem;
  width: 9rem;
  border: 1px solid black;
  color: black;
`;

const StyledMenuItem = styled(MenuItem)`
  background-color: black;
  color: white;
`;
