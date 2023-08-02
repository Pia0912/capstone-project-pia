import "./App.css";
import HobbyList from "./components/HobbyList";
import Header from "./components/Header";
import Button from "@mui/material/Button";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import AddForm from "./components/AddForm";
import useHobbies from "./hooks/useHobbies.ts";
import styled from "@emotion/styled";
import HobbyDetail from "./components/HobbyDetail.tsx";
import ActivityAddForm from "./components/ActivityAddForm.tsx";
import ActivityItem from "./components/ActivityItem.tsx";

export default function App() {
    const navigate = useNavigate();
    const colors = ['choose color', 'lightblue', 'lightgreen', 'pink', 'violet', 'orange', 'turquoise'];

    const { hobbies, handleAddHobby, handleEditHobby, handleDeleteHobby, handleAddActivity, handleEditActivity } = useHobbies();
    const { hobbyId, activityId } = useParams();

    if (!Array.isArray(hobbies)) {
        return <div>Loading hobbies...</div>;
    }

    const selectedHobby = hobbies.find((hobby) => hobby.id === hobbyId);

    const selectedActivity = selectedHobby?.activities.find((activity) => activity.activityId === activityId);

    return (
        <main>
            <Header />
            <Routes>
                <Route path="/add" element={<AddForm onAddHobby={handleAddHobby} />} />
                <Route
                    path="/:id/activities"
                    element={<HobbyDetail colors={colors}/>}
                />
                <Route
                    path="/:hobbyId/activities/add"
                    element={<ActivityAddForm onAddActivity={handleAddActivity} />}
                />
                <Route
                    path="/:hobbyId/activities/:activityId"
                    element={<ActivityItem activity={selectedActivity} hobby={selectedHobby} onEditActivity={handleEditActivity} colors={colors} />}
                />
                <Route
                    path="/"
                    element={(
                        <>
                            <StyledButtonAdd variant="contained" disableElevation onClick={() => navigate('/add')} >
                                +
                            </StyledButtonAdd>
                            <HobbyList hobbies={hobbies} colors={colors} onEditHobby={handleEditHobby} onDeleteHobby={handleDeleteHobby} />
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
