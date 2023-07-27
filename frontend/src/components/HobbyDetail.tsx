import {Activity, Hobby} from "../models.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import ActivityItem from "./ActivityItem.tsx";

type Props = {
    hobby: Hobby;
    activities: Activity[];
};
export default function HobbyDetail(props: Props) {

    const [hobby, setHobby] = useState<Hobby>();

    const params = useParams();

    useEffect(() => {
        axios.get(`/api/hobbies/${params.id}`)
            .then(response => response.data)
            .then(data => setHobby(data))
            .catch(console.error);
    }, [params.id]);


    if (!hobby) {
        return <>No Party</>
    }

    return (
        <>
        <div>{props.hobby.name}</div>
        <main>
            {props.activities.map(activity => <ActivityItem activity={activity} key={activity.id}/>)}

        </main>
        </>
    );
}