import './App.css';
import HobbyList from './components/HobbyList';
import Header from './components/Header';
import Button from '@mui/material/Button';
import {Route, Routes, useNavigate} from 'react-router-dom';
import AddForm from './components/AddForm';
import useHobbies from "./hooks/useHobbies.ts";


export default function App() {

    const navigate = useNavigate();
    const colors = [' ', 'lightblue', 'lightgreen', 'pink', 'violet', 'orange', 'turquoise'];

    const {hobbies, handleAddHobby} = useHobbies()


    return (
        <main>
            <Header />
            <Routes>
                <Route
                    path="/add"
                    element={<AddForm onAddHobby={handleAddHobby} />}
                />
                <Route
                    path="/"
                    element={(
                        <>
                            <Button variant="contained" disableElevation onClick={() => navigate('/add')} sx={{ ml: '75%', mr: '20%', mb: '2rem', fontSize: '25px' }}>
                                +
                            </Button>
                            <HobbyList hobbies={hobbies} colors={colors} />
                        </>
                    )}
                />
            </Routes>
        </main>
    );
}
