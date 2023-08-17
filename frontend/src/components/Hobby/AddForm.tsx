import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { HobbyWithoutID } from '../../models.ts';
import { Container } from '@mui/material';
import styled from "@emotion/styled";

type Props = {
    onAddHobby: (data: HobbyWithoutID) => void;
    colors: string[];
};

export default function AddForm(props: Props) {
    const [name, setName] = useState<string>("");
    const [color, setColor] = useState<string>("");

    const navigate = useNavigate();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data: HobbyWithoutID = {
            name: name,
            color: color,
        };
        props.onAddHobby(data);
        setName("");
        setColor("");
        navigate("/hobbies");
    }

    function handleColorChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setColor(event.target.value);
    }

    return (
        <StyledContainer>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Add new Hobby</legend>
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
                    <label htmlFor="color">Color: </label>
                    <select
                        value={color}
                        onChange={handleColorChange}
                        name="color"
                        id="color"
                    >
                        <option value="">Select a color</option>
                        {props.colors.map((color) => (
                            <option key={color} value={color}>
                                {color}
                            </option>
                        ))}
                    </select>
                </fieldset>
                <StyledButton type="submit" variant="outlined">
                    Submit
                </StyledButton>
            </form>
            <StyledButtonBack variant="contained" disableElevation onClick={() => navigate('/hobbies')} >
                Back to List
            </StyledButtonBack>
        </StyledContainer>
    );
}

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 3rem;
  background-color: cornflowerblue;
  padding-bottom: 17rem;
`;

const StyledButton = styled(Button)`
  width: 9rem;
  border-color: black;
  color: black;
  &:hover {
    border-color: limegreen;
  }
`;

const StyledButtonBack = styled(Button)`
  margin-top: 1rem;
  width: 9rem;
  background-color: black;
  &:hover {
    border-color: darkred;
    background-color: darkred;
  }
`;
