import { useEffect, useState } from "react";
import { Activity, Hobby } from "../models.ts";
import { useParams } from "react-router-dom";
import axios from "axios";

type ActivitiesData = { hobby: Hobby; activities: Activity[] | undefined };

export default function useActivities(): ActivitiesData | undefined {
    const [data, setData] = useState<ActivitiesData | undefined>(undefined);
    const params = useParams();

    useEffect(() => {
        axios
            .get(`/api/hobbies/${params.id}`)
            .then((response) => {
                const hobbyData = response.data;
                axios
                    .get(`/api/hobbies/${hobbyData.id}/activities`)
                    .then((activitiesResponse) =>
                        setData({ hobby: hobbyData, activities: activitiesResponse.data })
                    )
                    .catch(console.error);
            })
            .catch(() => setData(undefined));
    }, [params.id]);

    return data;
}
