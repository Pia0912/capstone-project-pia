import {FormEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import {HobbyWithoutID} from '../models';
import {Container} from '@mui/material';

type Props = {
    onAddHobby: (data: HobbyWithoutID) => void;
};

export default function AddForm(props: Props) {
    const [name, setName] = useState<string>("");

    const navigate = useNavigate();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data: HobbyWithoutID = {
            name: name,
        };
        props.onAddHobby(data);
        setName("");
        navigate("/");
    }

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '28px' }}>Add new Hobby</legend>
                    <label htmlFor="name">Name: </label>
                    <input
                        onChange={(event) => setName(event.target.value)}
                        value={name}
                        name="name"
                        id="name"
                        type="text"
                        required
                        style={{ marginLeft: '20px', marginRight: '20px' }}
                    />
                </fieldset>
                <Button type="submit" variant="outlined" sx={{ mr: '1rem', width: '9rem'}}>
                    Submit
                </Button>
            </form>
            <Button variant="contained" disableElevation onClick={() => navigate('/')} sx={{ mr: '1rem', mt: '1rem', width: '9rem'}}>
                Back to List
            </Button>
        </Container>
    );
}
