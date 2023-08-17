import "./App.css";
import Header from "./components/Header";

import {Route, Routes, useNavigate} from "react-router-dom";
import AddForm from "./components/Hobby/AddForm.tsx";
import useHobbies from "./hooks/useHobbies.ts";
import styled from "@emotion/styled";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import { useState} from "react";
import InfoTab from "./components/ProfilePage/InfoTab.tsx";
import StatisticTab from "./components/ProfilePage/StatisticTab.tsx";
import CalendarActivityAddForm from "./components/Activity/CalendarActivityAddForm.tsx";
import useActivities from "./hooks/useActivities.ts";
import LoginForm from "./components/User/LoginForm.tsx";

import RegisterForm from "./components/User/RegisterForm.tsx";
import SettingsTab from "./components/ProfilePage/SettingsTab.tsx";
import HomePage from "./components/HomePage.tsx";
import useUser from "./hooks/useUser.ts";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import Hobby_Routing from "./Hobby_Routing.tsx";
export default function App() {
    const navigate = useNavigate();
    const colors = ['coral', 'lightblue', 'cornflowerblue', 'lightgreen', 'seagreen', 'pink', 'mediumpurple', 'orange', 'tomato', 'peachpuff'];
    const [value, setValue] = useState(0);

    const {hobbies, hobby, handleAddHobby} = useHobbies();
    const { handleAddActivityToHobby} = useActivities();

    const { user, userId, handleLogin, handleRegister, handleLogout} = useUser();

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
                    <Route path={"/"} element={<HomePage />}/>
                    <Route path={"/login"} element={<LoginForm onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegisterForm onRegister={handleRegister} />} />

                    <Route element={<ProtectedRoutes user={user} />}>
                        <Route path={"/hobbies"} element={<Hobby_Routing/>} />

                        <Route path={"profile/*"} element={<InfoTab />} />
                        <Route path={"profile/info"} element={<InfoTab />} />
                        <Route path={"profile/stats"} element={<StatisticTab />} />
                        <Route path={"/profile/settings"} element={<SettingsTab user={user} userId={userId} onLogout={handleLogout}/>} />

                        <Route path={"/add"} element={<AddForm onAddHobby={handleAddHobby} colors={colors}/>}/>
                        <Route path={"/calendar/add/"} element={<CalendarActivityAddForm onAddActivity={handleAddActivityToHobby} hobbies={hobbies} hobby={hobby}/>} />
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
