import { useEffect, useState } from "react";
import { Activity, Hobby } from "../models.ts";
import { useParams } from "react-router-dom";
import axios from "axios";

type ActivitiesData = { hobby: Hobby; activities: Activity[] };
const api = axios.create({
    baseURL: "/api",
});

export default function useActivities(): ActivitiesData | null {
    const [data, setData] = useState<ActivitiesData | null>(null);
    const params = useParams();

    useEffect(() => {
        api.get(`/hobbies/${params.id}`)
            .then((response) => {
                const hobbyData = response.data;
                api.get(`/hobbies/${hobbyData.id}/activities`)
                    .then((activitiesResponse) =>
                        setData({ hobby: hobbyData, activities: activitiesResponse.data })
                    )
                    .catch(console.error);
            })
            .catch(() => setData(null));
    }, [params.id]);

    return data;
}
