import "./App.css";
import HobbyList from "./components/HobbyList";
import Header from "./components/Header";
import Button from "@mui/material/Button";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import AddForm from "./components/AddForm";
import useHobbies from "./hooks/useHobbies.ts";
import styled from "@emotion/styled";
import HobbyDetail from "./components/HobbyDetail.tsx";
import ActivityAddForm from "./components/Activity/ActivityAddForm.tsx";
import ActivityItem from "./components/Activity/ActivityItem.tsx";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import InAppPurchase from "./components/InAppPurchase.tsx";
import InfoTab from "./components/ProfilePage/InfoTab.tsx";
import StatisticTab from "./components/ProfilePage/StatisticTab.tsx";
import GoalsTab from "./components/ProfilePage/GoalsTab.tsx";
import SettingsTab from "./components/ProfilePage/SettingsTab.tsx";
import BadgesTab from "./components/ProfilePage/BadgesTab.tsx";
import FriendsTab from "./components/ProfilePage/FriendsTab.tsx";
import Calendar from "./components/Calendar.tsx";

export default function App() {
    const navigate = useNavigate();
    const colors = ['choose color', 'lightblue', 'cornflowerblue', 'lightgreen', 'pink', 'mediumpurple', 'orange', 'tomato'];
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    const {
        hobbies,
        handleAddHobby,
        handleEditHobbyName,
        handleEditHobbyColor,
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
        navigate("/profile/info");
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
                    <Route path="/profile/info" element={<InfoTab />} />
                    <Route path="/profile/stats" element={<StatisticTab />} />
                    <Route path="/profile/goals" element={<GoalsTab />} />
                    <Route path="/profile/settings" element={<SettingsTab />} />
                    <Route path="/profile/badges" element={<BadgesTab />} />
                    <Route path="/profile/friends" element={<FriendsTab />} />
                    <Route path="/profile/*" element={<InfoTab />} />

                    <Route path="/app" element={<InAppPurchase/>}/>
                    <Route path="/add" element={<AddForm onAddHobby={handleAddHobby} colors={colors}/>}/>
                    <Route
                        path="/:id/activities"
                        element={<HobbyDetail colors={colors}/>}
                    />
                    <Route
                        path="/:hobbyId/activities/add"
                        element={<ActivityAddForm onAddActivity={handleAddActivity} color={selectedHobby?.color || colors[0]}/>}
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
                                <Calendar />
                                <StyledH2>Hobby List</StyledH2>
                                <StyledButtonAdd variant="contained" disableElevation onClick={() => navigate('/add')}>
                                    +
                                </StyledButtonAdd>
                                <HobbyList hobbies={hobbies} colors={colors} onEditHobbyName={handleEditHobbyName}
                                           onEditHobbyColor={handleEditHobbyColor}
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
                    <StyledBottomNavigationAction label="List" icon={<CalendarMonthIcon/>} onClick={handleListIconClick}/>
                    <StyledBottomNavigationAction label="Activities" icon={<SearchIcon/>} onClick={handleSearchIconClick}/>
                    <StyledBottomNavigationAction label="Profile" icon={<AccountCircleIcon/>}
                                            onClick={handleProfileIconClick}/>
                </StyledBottomNavigation>
            </StyledPaper>
        </>
    );
}

const StyledH2 = styled.h2`
  margin-top: 0;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-top: 4px solid black;
  border-radius: 5%;
  width: calc(100% - 8px);
`;

const StyledButtonAdd = styled(Button)`
  margin: 0.25rem 20% -6rem 75%;
  background-color: black;
  font-size: 25px;
`;

const StyledPaper = styled(Paper)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  z-index: 7;
`;


const StyledBottomNavigation = styled(BottomNavigation)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: black;
  height: 2rem; 
  position: fixed; 
  bottom: 0; 
  left: 0; 
  right: 0;
  margin: 0;
`;

const StyledBottomNavigationAction = styled(BottomNavigationAction)`
 color: white;
`;
