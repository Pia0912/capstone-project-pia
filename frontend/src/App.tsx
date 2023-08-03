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
import RestoreIcon from '@mui/icons-material/Restore';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import ProfilePage from "./components/ProfilePage.tsx";
import InAppPurchase from "./components/InAppPurchase.tsx";


export default function App() {
    const navigate = useNavigate();
    const colors = ['choose color', 'lightblue', 'lightgreen', 'pink', 'violet', 'orange', 'turquoise'];
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    const {
        hobbies,
        handleAddHobby,
        handleEditHobby,
        handleDeleteHobby,
        handleAddActivity,
        handleEditActivity,
        handleDeleteActivity
    } = useHobbies();
    const {hobbyId, activityId} = useParams();

    useEffect(() => {
        if (ref.current) {
            ref.current.ownerDocument.body.scrollTop = 0;
        }
    }, [value]);


    if (!Array.isArray(hobbies)) {
        return <div>Loading hobbies...</div>;
    }

    const selectedHobby = hobbies.find((hobby) => hobby.id === hobbyId);
    const selectedActivity = selectedHobby ? selectedHobby.activities.find((activity) => activity.activityId === activityId) : undefined;

    const handleProfileIconClick = () => {
        navigate("/profile");
    };

    const handleSearchIconClick = () => {
        navigate("/app");
    };

    const handleListIconClick = () => {
        navigate("/");
    };

    return (
        <>
            <Header/>
            <main>
                <Routes>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/app" element={<InAppPurchase/>}/>
                    <Route path="/add" element={<AddForm onAddHobby={handleAddHobby}/>}/>
                    <Route
                        path="/:id/activities"
                        element={<HobbyDetail colors={colors}/>}
                    />
                    <Route
                        path="/:hobbyId/activities/add"
                        element={<ActivityAddForm onAddActivity={handleAddActivity}/>}
                    />
                    <Route
                        path="/:hobbyId/activities/:activityId"
                        element={
                            selectedHobby && selectedActivity ? (
                                <ActivityItem
                                    activity={selectedActivity}
                                    hobby={selectedHobby}
                                    colors={colors}
                                    onEditActivity={handleEditActivity}
                                    onDeleteActivity={handleDeleteActivity}
                                />
                            ) : (
                                <div>Invalid hobby or activity ID.</div>
                            )
                        }/>
                    <Route
                        path="/"
                        element={(
                            <>
                                <StyledButtonAdd variant="contained" disableElevation onClick={() => navigate('/add')}>
                                    +
                                </StyledButtonAdd>
                                <HobbyList hobbies={hobbies} colors={colors} onEditHobby={handleEditHobby}
                                           onDeleteHobby={handleDeleteHobby}/>
                            </>
                        )}
                    />
                </Routes>
            </main>
            <StyledPaper elevation={10}>
                <StyledBottomNavigation
                    showLabels
                    value={value}
                    onChange={(_, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <StyledBottomNavigationAction label="List" icon={<RestoreIcon/>} onClick={handleListIconClick}/>
                    <StyledBottomNavigationAction label="Activities" icon={<SearchIcon/>} onClick={handleSearchIconClick}/>
                    <StyledBottomNavigationAction label="Profile" icon={<AccountCircleIcon/>}
                                            onClick={handleProfileIconClick}/>
                </StyledBottomNavigation>
            </StyledPaper>
        </>
    );
}

const StyledButtonAdd = styled(Button)`
  margin: 2rem 20% 2rem 75%;
  background-color: black;
  font-size: 25px;
  position: fixed;
  z-index: 1;
`;

const StyledPaper = styled(Paper)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  height: 4rem;
  z-index: 1;
`;


const StyledBottomNavigation = styled(BottomNavigation)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: black;
`;

const StyledBottomNavigationAction = styled(BottomNavigationAction)`
 color: white;
`;
