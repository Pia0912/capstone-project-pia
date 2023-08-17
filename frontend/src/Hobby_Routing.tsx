import "./App.css";
import HobbyList from "./components/Hobby/HobbyList.tsx";
import Button from "@mui/material/Button";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import useHobbies from "./hooks/useHobbies.ts";
import styled from "@emotion/styled";
import HobbyDetail from "./components/Activity/HobbyDetail.tsx";
import ActivityAddForm from "./components/Activity/ActivityAddForm.tsx";
import ActivityItem from "./components/Activity/ActivityItem.tsx";
import Calendar from "./components/Calendar/Calendar.tsx";
import useActivities from "./hooks/useActivities.ts";

import useUser from "./hooks/useUser.ts";
export default function Hobby_Routing() {
    const navigate = useNavigate();
    const colors = ['coral', 'lightblue', 'cornflowerblue', 'lightgreen', 'seagreen', 'pink', 'mediumpurple', 'orange', 'tomato', 'peachpuff'];

    const {hobbies, handleEditHobbyName, handleEditHobbyColor, handleDeleteHobby, hobby} = useHobbies();
    const hobbyId= hobby?.hobbyId;
    const { handleAddActivityToHobby, handleEditActivity, handleDeleteActivity} = useActivities();


    const { activityId} = useParams();
    const {user,} = useUser();

    const selectedHobby = hobbies.find((hobby) => hobby.hobbyId === hobbyId);
    const selectedActivity = selectedHobby ? selectedHobby.activities.find((activity) => activity.activityId === activityId) : undefined;

    return (
                <Routes>
                        <Route path=""
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

                </Routes>
    );
}

const StyledH2 = styled.h3`
  margin-top: 0;
  margin-right: 5rem;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  border-top: 4px solid black;
  width: 120%;
`;

const StyledButtonAdd = styled(Button)`
  margin: -3rem 0.2rem -6rem 60%;
  background-color: black;
  font-size: 25px;
  &:hover {
    background-color: darkorange;
  }
`;

