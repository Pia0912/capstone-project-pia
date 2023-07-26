import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import HobbyList from './components/HobbyList';
import {Hobby, HobbyWithoutID} from './models';
import Header from './components/Header';
import Button from '@mui/material/Button';
import {Route, Routes, useNavigate} from 'react-router-dom';
import AddForm from './components/AddForm';


export default function App() {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const colors = [' ', 'lightblue', 'lightgreen', 'pink', 'violet', 'orange', 'turquoise'];

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

    return (
        <>
            <Routes>
                <Route
                    path="/add"
                    element={<AddForm onAddHobby={handleAddHobby} />}
                />
                <Route
                    path="/"
                    element={(
                        <main>
                            <Header />
                            <Button variant="contained" disableElevation onClick={() => navigate('/add')} sx={{ ml: '75%', mr: '20%', mb: '2rem', fontSize: '25px' }}>
                                +
                            </Button>
                            <HobbyList hobbies={hobbies} colors={colors} />
                        </main>
                    )}
                />
            </Routes>
        </>
    );
}
