import './App.css';
import HobbyList from './components/HobbyList';
import Header from './components/Header';
import Button from '@mui/material/Button';
import {Route, Routes, useNavigate} from 'react-router-dom';
import AddForm from './components/AddForm';
import useHobbies from './hooks/useHobbies.ts';
import styled from "@emotion/styled";


export default function App() {

    const navigate = useNavigate();
    const colors = ['choose color', 'lightblue', 'lightgreen', 'pink', 'violet', 'orange', 'turquoise'];

    const {hobbies, handleAddHobby, handleEditHobby, handleDeleteHobby } = useHobbies()

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
                            <StyledButtonAdd variant="contained" disableElevation onClick={() => navigate('/add')} >
                                +
                            </StyledButtonAdd>
                            <HobbyList hobbies={hobbies} colors={colors} onEditHobby={handleEditHobby} onDeleteHobby={handleDeleteHobby}/>
                        </>
                    )}
                />
            </Routes>
        </main>
    );
}

const StyledButtonAdd = styled(Button)`
  margin: 0 20% 2rem 75%;
  background-color: black;
  font-size: 25px;
`;
