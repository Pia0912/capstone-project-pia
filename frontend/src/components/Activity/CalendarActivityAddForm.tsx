import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Button from '@mui/material/Button';
import { ActivityWithoutID, Hobby } from '../../models';
import { Container, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import styled from '@emotion/styled';
import {useSuccessMessage} from "../../hooks/useSuccessMessage.tsx";
import useActivities from "../../hooks/useActivities.ts";
import StarRating from "./StarRating.tsx";

type Props = {
    hobbies: Hobby[];
    onAddActivity: (hobbyId: string, activity: ActivityWithoutID) => void;
    hobby: Hobby | undefined;
};

export default function CalendarActivityAddForm(props: Props) {
    const [name, setName] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [rating, setRating] = useState<number>(5);
    const [selectedHobbyId, setSelectedHobbyId] = useState<string>('');

    const navigate = useNavigate();
    const { showSuccessMessage } = useSuccessMessage();
    const { handleAddActivityToHobby } = useActivities();

    const { dateFromUrl } = useParams<{ dateFromUrl: string }>();
    const parsedUrlDate = dateFromUrl
        ? new Date(Date.parse(dateFromUrl.split('.').reverse().join('-')))
        : null;
    const formattedDateForBackend = parsedUrlDate?.toISOString() || '';

    if (formattedDateForBackend && !date) {
        setDate(formattedDateForBackend);
    }

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

        handleAddActivityToHobby(selectedHobbyId, newActivity);
        setName('');
        setDate('');
        setRating(5);
        setSelectedHobbyId('');
        showSuccessMessage('Activity added successfully!');
        navigate('/hobbies');
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
                        <InputLabel style={{color: 'white', fontSize:'17px'}}>Select a hobby</InputLabel>
                        <StyledSelect
                            value={selectedHobbyId}
                            onChange={(event) => setSelectedHobbyId(event.target.value as string)}
                            required
                        >
                            <StyledMenuItem value="add-hobby" onClick={handleAddNewHobby}>
                                + Add New Hobby
                            </StyledMenuItem>
                            {props.hobbies.map((hobby) => (
                                <MenuItem key={hobby.hobbyId} value={hobby.hobbyId}>
                                    {hobby.name}
                                </MenuItem>
                            ))}
                        </StyledSelect>
                    </FormControl>
                    <label htmlFor="name">Activity name: </label>
                    <input
                        onChange={(event) => setName(event.target.value)}
                        value={name}
                        name="name"
                        id="name"
                        type="text"
                        required
                        className="input-add"
                    />
                    <label htmlFor="name">Activity date: </label>
                    <input
                        onChange={(event) => setDate(event.target.value)}
                        value={dateFromUrl}
                        name="date"
                        id="date"
                        type="text"
                        required
                        className="input-add"
                    />
                    <label htmlFor="rating">Rating:</label>
                    <StarRating initialRating={rating} onChange={setRating} activityId="new-activity" />
                </fieldset>
                <StyledButtonSubmit type="submit" variant="contained">
                    Submit
                </StyledButtonSubmit>
            </form>
            <StyledButtonBack variant="outlined" disableElevation onClick={() => navigate(`/hobbies`)} >
                Back to Calendar
            </StyledButtonBack>
        </StyledContainer>
    );
}

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 3rem;
`;

const StyledSelect= styled(Select)`
  width: 370px;
  height: 60px;
  border: 1px solid black;
  justify-content: center;
  background-color: black;
  color: white;
  border-radius: 15px;
`;

const StyledButtonSubmit = styled(Button)`
  width: 9rem;
  background-color: black;
  &:hover {
    background-color: limegreen;
    border-color: limegreen;
  }
`;

const StyledButtonBack = styled(Button)`
  margin-top: 1rem;
  width: 9rem;
  border: 1px solid black;
  color: black;
  &:hover {
    border-color: darkred;
    color: darkred;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  background-color: black;
  color: white;
`;
