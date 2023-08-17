import "./App.css";
import {Route, Routes, useParams} from "react-router-dom";
import useHobbies from "./hooks/useHobbies.ts";

import HobbyDetail from "./components/Activity/HobbyDetail.tsx";
import ActivityAddForm from "./components/Activity/ActivityAddForm.tsx";
import ActivityItem from "./components/Activity/ActivityItem.tsx";

import useActivities from "./hooks/useActivities.ts";
import React from "react";
export default function Hobby_Routing() {
    const colors = ['coral', 'lightblue', 'cornflowerblue', 'lightgreen', 'seagreen', 'pink', 'mediumpurple', 'orange', 'tomato', 'peachpuff'];

    const {hobbies, hobby} = useHobbies();
    const hobby_Id= hobby?.hobbyId;
    const { handleAddActivityToHobby, handleEditActivity, handleDeleteActivity, fetchActivitiesData} = useActivities();


    const { hobbyId, activityId } = useParams();

    const selectedHobby = hobbies.find((hobby) => hobby.hobbyId === hobby_Id);
    const selectedActivity = selectedHobby ? selectedHobby.activities.find((activity) => activity.activityId === activityId) : undefined;



    React.useEffect(() => {
        if (hobbyId) {
            fetchActivitiesData(hobbyId);
        }
    }, [fetchActivitiesData, hobbyId]);

    return (
                <Routes>


                        <Route path={"/hobby/:hobbyId/activities"} element={<HobbyDetail colors={colors} hobby={hobby}/>}/>
                        <Route path={"/hobby/:hobbyId/activities/add"} element={<ActivityAddForm onAddActivity={handleAddActivityToHobby} color={selectedHobby?.color ?? colors[0]}/>}/>
                        <Route path={"/hobby/:hobbyId/activities/:activityId"}
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


