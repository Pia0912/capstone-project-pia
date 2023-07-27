import { Activity } from "../models";
import { useLocation } from "react-router-dom";

type Props = {
    activity: Activity;
};

export default function ActivityItem(props: Props) {
    const location = useLocation();
    const selectedColor = location.state?.selectedColor || "#f2f2f2";

    return (

            <div className="activity-card">
                <div className="activity-header" style={{ backgroundColor: selectedColor }}>
                    <h3 className="activity-name">{props.activity.name}</h3>
                    <h2 className="activity-date">{props.activity.date}</h2>
                </div>
            </div>
    );
}
