import { useEffect, useState } from "react";
import { Activity, Hobby } from "../models.ts";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function useActivities() {
    const [hobby, setHobby] = useState<Hobby | "no hobby">();
    const [activities, setActivities] = useState<Activity[] | undefined>();

    const params = useParams();

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

    if (hobby === undefined) {
        return "loading";
    } else if (hobby === "no hobby") {
        return "no hobby";
    }

    return { hobby, activities };
}
