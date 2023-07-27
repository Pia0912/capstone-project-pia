import {Activity} from "../models";



type Props = {
    activity: Activity;
};

export default function ActivityItem(props: Props) {
    return (
            <div className="div-item" >
                            <h3>{props.activity.name}</h3>
                <h2>{props.activity.date}</h2>
                            </div>

    );
}

