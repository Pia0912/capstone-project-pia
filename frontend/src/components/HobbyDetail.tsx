import {useEffect, useState} from "react";
import axios from "axios";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ActivityItem from "./ActivityItem";
import {Activity, Hobby} from "../models.ts";
import {Button, Grid} from "@mui/material";
import styled from "@emotion/styled";

export default function HobbyDetail() {
    const [hobby, setHobby] = useState<Hobby | null>(null);
    const [activities, setActivities] = useState<Activity[] | null>(null);
    const params = useParams();
    const navigate = useNavigate();

    const location = useLocation();
    const selectedColor = location.state?.selectedColor || "#f2f2f2";

    useEffect(() => {
        axios
            .get(`/api/hobbies/${params.id}`)
            .then((response) => {
                const hobbyData = response.data;
                setHobby(hobbyData);
                axios
                    .get(`/api/hobbies/${hobbyData.id}/activities`)
                    .then((activitiesResponse) => setActivities(activitiesResponse.data))
                    .catch(console.error);
            })
            .catch(console.error);
    }, [params.id]);

    if (!hobby) {
        return <>No Hobby</>;
    }

    const loadActivities = () => {
        if (activities === null) {
            return <>Loading...</>;
        } else if (activities.length === 0) {
            return <>No Activities found for this Hobby</>;
        } else {
            return activities.map((activity) => (

                    <ActivityItem key={activity.id} activity={activity}/>

            ));
        }
    };


    return (
        <>
            <div className="div-header" style={{backgroundColor: selectedColor}}>
                {hobby.name}
            </div>
            <Grid container spacing={2}>
                {loadActivities()}
            </Grid>
            <StyledButtonBack
                variant="contained"
                disableElevation
                onClick={() => navigate("/")}
            >
                Back to List
            </StyledButtonBack>
        </>
    );
}

const StyledButtonBack = styled(Button)`
  margin-top: 1rem;
  width: 9rem;
  background-color: black;
`;
