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
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        let isMounted = true;
        api
            .get(`/hobbies/${params.id}`)
            .then((response) => {
                const hobbyData = response.data;
                api
                    .get(`/hobbies/${hobbyData.id}/activities`)
                    .then((activitiesResponse) => {
                        if (isMounted) {
                            setData({ hobby: hobbyData, activities: activitiesResponse.data });
                            setLoading(false);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        if (isMounted) {
                            setLoading(false);
                        }
                    });
            })
            .catch((error) => {
                console.error(error);
                if (isMounted) {
                    setData(null);
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [params.id]);

    return loading ? null : data;
}
