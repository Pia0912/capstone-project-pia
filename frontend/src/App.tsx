import "./App.css";
import HobbyList from "./components/HobbyList";
import Header from "./components/Header";
import Button from "@mui/material/Button";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import AddForm from "./components/AddForm";
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

export default function App() {
    const navigate = useNavigate();
    const colors = ['coral', 'lightblue', 'cornflowerblue', 'lightgreen', 'seagreen', 'pink', 'mediumpurple', 'orange', 'tomato', 'peachpuff'];
    const [value, setValue] = useState(0);

    const {hobbies, handleAddHobby, handleEditHobbyName, handleEditHobbyColor, handleDeleteHobby,} = useHobbies();
    const { handleAddActivityToHobby, handleEditActivity, handleDeleteActivity} = useActivities();
    const {hobbyId, activityId} = useParams();


    if (!Array.isArray(hobbies)) {
        return <div>Loading hobbies...</div>;
    }

    const selectedHobby = hobbies.find((hobby) => hobby.hobbyId === hobbyId);
    const selectedActivity = selectedHobby ? selectedHobby.activities.find((activity) => activity.activityId === activityId) : undefined;

    const handleProfileIconClick = () => {
        navigate("/profile/info");
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
                    <Route path="/profile/*" element={<InfoTab />} />

                    <Route path="/app" element={<InAppPurchase/>}/>
                    <Route path="/add" element={<AddForm onAddHobby={handleAddHobby} colors={colors}/>}/>

                    <Route path="/calendar/add/" element={<CalendarActivityAddForm onAddActivity={handleAddActivityToHobby} hobbies={hobbies}/>} />
                    <Route
                        path="/hobby/:hobbyId/activities"
                        element={<HobbyDetail colors={colors}/>}
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
                    <StyledBottomNavigationAction label="Profile" icon={<AccountCircleIcon/>}
                                            onClick={handleProfileIconClick}/>
                </StyledBottomNavigation>
            </StyledPaper>
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
