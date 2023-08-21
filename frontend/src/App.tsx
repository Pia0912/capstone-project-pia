import "./App.css";
import HobbyList from "./components/Hobby/HobbyList.tsx";
import Header from "./components/Header";
import {Route, Routes, useNavigate} from "react-router-dom";
import AddForm from "./components/Hobby/AddForm.tsx";
import useHobbies from "./hooks/useHobbies.ts";
import styled from "@emotion/styled";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
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
import ProtectedRoutes from "./ProtectedRoutes.tsx";
import Calendar from "./components/Calendar/Calendar.tsx";
import Button from "@mui/material/Button";
import HobbyDetail from "./components/Activity/HobbyDetail.tsx";
import ActivityAddForm from "./components/Activity/ActivityAddForm.tsx";
import ActivityItem from "./components/Activity/ActivityItem.tsx";
import Activities from "./components/Activity/ActivityList.tsx";
export default function App() {
    const navigate = useNavigate();
    const colors = ['coral', 'lightblue', 'cornflowerblue', 'lightgreen', 'seagreen', 'pink', 'mediumpurple', 'orange', 'tomato', 'peachpuff'];
    const [value, setValue] = useState(0);

    const { user, userId, handleLogin, handleRegister, handleLogout} = useUser();

    const {hobbies, hobby, handleAddHobby, handleEditHobbyName, handleEditHobbyColor, handleDeleteHobby, } = useHobbies(userId);
    const { handleAddActivityToHobby, handleEditActivity, handleDeleteActivity, activity} = useActivities();
    const handleProfileIconClick = () => {
        navigate("/profile/info");
    };

    const handleListIconClick = () => {
        navigate("/hobbies");
    };

    const handleSearchIconClick = () => {
        navigate("/activities");
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

                        <Route path={"/hobbies"}
                               element={(
                                   <>
                                       <Calendar />
                                       <StyledH2>{user}s Hobby List</StyledH2>
                                       <StyledButtonAdd variant="contained" disableElevation onClick={() => navigate('/add')}>
                                           +
                                       </StyledButtonAdd>

                                       <HobbyList hobbies={hobbies} colors={colors}
                                                  onEditHobbyName={handleEditHobbyName}
                                                  onEditHobbyColor={handleEditHobbyColor}
                                                  onDeleteHobby={handleDeleteHobby}/>
                                   </>
                               )}
                        />

                        <Route path={"/hobby/:hobbyId/activities"} element={<HobbyDetail colors={colors} hobby={hobby}/>}/>
                        <Route path={"/hobby/:hobbyId/activities/add"} element={<ActivityAddForm onAddActivity={handleAddActivityToHobby} color={hobby?.color ?? colors[0]}/>}/>
                        <Route path={"/hobby/:hobbyId/activities/:activityId"}
                               element={
                                   hobby && activity ? (
                                       <ActivityItem
                                           activity={activity}
                                           hobby={hobby}
                                           colors={colors}
                                           onEditActivity={handleEditActivity}
                                           onDeleteActivity={handleDeleteActivity}
                                       />
                                   ) : (
                                       <div>Invalid hobby or activity ID.</div>
                                   )
                               }/>

                        <Route path={"profile/*"} element={<InfoTab hobbies={hobbies}/>} />
                        <Route path={"profile/info"} element={<InfoTab hobbies={hobbies}/>} />
                        <Route path={"profile/stats"} element={<StatisticTab />} />
                        <Route path={"/profile/settings"} element={<SettingsTab user={user} userId={userId} onLogout={handleLogout}/>} />

                        <Route path={"/add"} element={<AddForm onAddHobby={handleAddHobby} colors={colors}/>}/>
                        <Route path={"/calendar/add/:dateFromUrl"} element={<CalendarActivityAddForm onAddActivity={handleAddActivityToHobby} hobbies={hobbies} hobby={hobby}/>} />

                        <Route path={"/activities"} element={<Activities/>}/>

                    </Route>

                </Routes>
            </main>
            {location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/register" && (
                <StyledPaper elevation={10}>
                    <StyledBottomNavigation
                        value={value}
                        onChange={(_, newValue) => {
                            setValue(newValue);
                        }}
                    >
                        <StyledBottomNavigationAction label="Hobbies" icon={<CalendarMonthIcon/>} onClick={handleListIconClick}/>
                        <StyledBottomNavigationAction label="Activities" icon={<LocalActivityIcon/>} onClick={handleSearchIconClick}/>
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

const StyledH2 = styled.h4`
  margin-top: 0;
  margin-right: 5rem;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  border-top: 4px solid black;
  width: 120%;
`;

const StyledButtonAdd = styled(Button)`
  margin: -3rem 0.2rem -6rem 80%;
  background-color: black;
  font-size: 25px;
  &:hover {
    background-color: darkorange;
  }
`;

