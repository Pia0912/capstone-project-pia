import "./App.css";
import HobbyList from "./components/Hobby/HobbyList.tsx";
import Header from "./components/Header";
import Button from "@mui/material/Button";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import AddForm from "./components/Hobby/AddForm.tsx";
import useHobbies from "./hooks/useHobbies.ts";
import styled from "@emotion/styled";
import HobbyDetail from "./components/Activity/HobbyDetail.tsx";
import ActivityAddForm from "./components/Activity/ActivityAddForm.tsx";
import ActivityItem from "./components/Activity/ActivityItem.tsx";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import { useState} from "react";
import InAppPurchase from "./components/InAppPurchase.tsx";
import InfoTab from "./components/ProfilePage/InfoTab.tsx";
import StatisticTab from "./components/ProfilePage/StatisticTab.tsx";
import Calendar from "./components/Calendar/Calendar.tsx";
import CalendarActivityAddForm from "./components/Activity/CalendarActivityAddForm.tsx";
import useActivities from "./hooks/useActivities.ts";
import LoginForm from "./components/User/LoginForm.tsx";

import RegisterForm from "./components/User/RegisterForm.tsx";

import SettingsTab from "./components/ProfilePage/SettingsTab.tsx";
import HomePage from "./components/HomePage.tsx";
import useUser from "./hooks/useUser.ts";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
export default function App() {
    const navigate = useNavigate();
    const colors = ['coral', 'lightblue', 'cornflowerblue', 'lightgreen', 'seagreen', 'pink', 'mediumpurple', 'orange', 'tomato', 'peachpuff'];
    const [value, setValue] = useState(0);

    const {hobbies, handleAddHobby, handleEditHobbyName, handleEditHobbyColor, handleDeleteHobby, hobby} = useHobbies();
    const hobbyId= hobby?.hobbyId;
    const { handleAddActivityToHobby, handleEditActivity, handleDeleteActivity} = useActivities(hobbyId);


    const { activityId} = useParams();
    const {user, userId, handleLogin, handleRegister, handleLogout} = useUser();

    const selectedHobby = hobbies.find((hobby) => hobby.hobbyId === hobbyId);
    const selectedActivity = selectedHobby ? selectedHobby.activities.find((activity) => activity.activityId === activityId) : undefined;

    const handleProfileIconClick = () => {
        navigate("/profile/info");
    };

    const handleListIconClick = () => {
        navigate("/hobbies");
    };

    return (
        <>
            <Header/>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />}/>
                    <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegisterForm onRegister={handleRegister} />} />


                    <Route element={<ProtectedRoutes user={user} />}>
                        <Route path="/hobbies"
                               element={(
                                   <>
                                       <Calendar />

                                       <StyledH2>{user}s Hobby List</StyledH2>
                                       <StyledButtonAdd variant="contained" disableElevation onClick={() => navigate('/add')}>
                                           +
                                       </StyledButtonAdd>

                                       <HobbyList hobbies={hobbies} colors={colors} onEditHobbyName={handleEditHobbyName}
                                                  onEditHobbyColor={handleEditHobbyColor}
                                                  onDeleteHobby={handleDeleteHobby}/>
                                   </>
                               )}
                        />

                    <Route path="profile/info" element={<InfoTab />} />
                    <Route path="profile/stats" element={<StatisticTab />} />
                        <Route path="/profile/settings" element={<SettingsTab user={user} userId={userId} onLogout={handleLogout}/>} />

                        <Route path="profile/*" element={<InfoTab />} />

                    <Route path="/app" element={<InAppPurchase/>}/>
                    <Route path="/add" element={<AddForm onAddHobby={handleAddHobby} colors={colors}/>}/>

                    <Route path="/calendar/add/" element={<CalendarActivityAddForm onAddActivity={handleAddActivityToHobby} hobbies={hobbies}/>} />
                        <Route
                        path="/hobby/:hobbyId/activities"
                        element={<HobbyDetail colors={colors} hobby={hobby}/>}
                    />
                    <Route
                        path="/hobby/:hobbyId/activities/add"
                        element={<ActivityAddForm onAddActivity={handleAddActivityToHobby} color={selectedHobby?.color ?? colors[0]}/>}
                    />
                    <Route
                        path="/hobby/:hobbyId/activities/:activityId"
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

                    </Route>

                </Routes>
            </main>
            {location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/register" && (
                <StyledPaper elevation={10}>
                    <StyledBottomNavigation
                        showLabels
                        value={value}
                        onChange={(_, newValue) => {
                            setValue(newValue);
                        }}
                    >
                        <StyledBottomNavigationAction label="List" icon={<CalendarMonthIcon/>} onClick={handleListIconClick}/>
                        <StyledBottomNavigationAction label="Profile" icon={<AccountCircleIcon/>} onClick={handleProfileIconClick}/>
                    </StyledBottomNavigation>
                </StyledPaper>
            )}
        </>
    );
}

const StyledH2 = styled.h2`
  margin-top: 0;
  margin-right: 3.5rem;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  border-top: 4px solid black;
  border-radius: 5%;
  width: 550px;
`;

const StyledButtonAdd = styled(Button)`
  margin: -3.5rem 0.25rem -5rem 60%;
  background-color: black;
  font-size: 25px;
  &:hover {
    background-color: darkorange;
  }
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
