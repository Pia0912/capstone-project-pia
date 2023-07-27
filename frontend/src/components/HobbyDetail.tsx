// HobbyDetail.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ActivityItem from "./ActivityItem";
import { Activity, Hobby } from "../models.ts";

export default function HobbyDetail() {
    const [hobby, setHobby] = useState<Hobby | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);

    const params = useParams();

    useEffect(() => {
        axios.get(`/api/hobbies/${params.id}`)
            .then(response => {
                const hobbyData = response.data;
                setHobby(hobbyData);
                axios.get(`/api/hobbies/${hobbyData.id}/activities`)
                    .then(activitiesResponse => setActivities(activitiesResponse.data))
                    .catch(console.error);
            })
            .catch(console.error);
    }, [params.id]);

    if (!hobby) {
        return <>No Hobby</>;
    }

    return (
        <>
            <div>{hobby.name}</div>
            <main>
                {activities.map(activity => <ActivityItem activity={activity} key={activity.id} />)}
            </main>
        </>
    );
}
