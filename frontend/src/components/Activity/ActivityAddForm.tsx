import {FormEvent, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Button from '@mui/material/Button';
import {ActivityWithoutID} from '../../models.ts';
import {Container} from '@mui/material';
import styled from "@emotion/styled";
import StarRating from "./StarRating.tsx";

type Props = {
    onAddActivity: (hobbyId: string, activity: ActivityWithoutID) => void;
    color: string;
};

export default function ActivityAddForm(props: Props) {
    const [name, setName] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [rating, setRating] = useState<number>(5);

    const { hobbyId } = useParams();

    const navigate = useNavigate();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!hobbyId) {
            console.error("Hobby ID is undefined!");
            return;
        }

        const newActivity: ActivityWithoutID = {
            name: name,
            activityDate: date,
            rating: rating,
            hobbyId: hobbyId,
            color: props.color,
        };
        props.onAddActivity(hobbyId, newActivity);
        setName("");
        setDate("");
        setRating(5);
    }

    return (
        <StyledContainer>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Add new Activity</legend>
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
                    <label htmlFor="rating">Rating:</label>
                    <StarRating initialRating={rating} onChange={setRating} activityId="new-activity" />
                </fieldset>
                <StyledButton type="submit" variant="outlined">
                    Submit
                </StyledButton>
            </form>
            <StyledButtonBack variant="contained" disableElevation onClick={() => navigate(`/${hobbyId}/activities`)} >
                Back to Activities
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

const StyledButton = styled(Button)`
  width: 9rem;
  border-color: black;
  color: black;
`;

const StyledButtonBack = styled(Button)`
  margin-top: 1rem;
  width: 9rem;
  background-color: black;
`;
