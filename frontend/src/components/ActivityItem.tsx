import { Activity } from "../models";
import { useLocation } from "react-router-dom";

type Props = {
    activity: Activity;
};

export default function ActivityItem(props: Props) {
    const location = useLocation();
    const selectedColor = location.state?.selectedColor || "#f2f2f2";

    return (

        <div className="flip-card" style={{ backgroundColor: selectedColor }}>
            <div className="flip-card-inner">
                <div className="flip-card-front" style={{ backgroundColor: selectedColor }}>
                    <h3>{props.activity.name}</h3>
                    <p>{props.activity.date}</p>
                </div>
                <div className="flip-card-back">

                    <p>Rating: </p>
                </div>
            </div>
        </div>
    );
}
