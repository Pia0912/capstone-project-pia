import React from "react";
import { ButtonGroup} from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router-dom";
import {ActivityWithColor} from "../../models.ts";

type Props = {
    dayInfo: ActivityWithColor | null;
    currentDate: Date;
    today: Date;
    handleGradient: () => string;
    dayActivityCounts: Record<number, number>;
}
export default function Day(props: Props) {
    console.log(props.dayInfo)
    console.log(props.dayInfo?.name)

    const navigate = useNavigate();

    if (!props.dayInfo) {
        return <li></li>;
    }

    const { day, color } = props.dayInfo;
    const currentDay = props.today.getDate();
    const currentMonth = props.today.getMonth();
    const currentYear = props.today.getFullYear();
    const isActive =
        currentDay === day && currentMonth === props.currentDate.getMonth() && currentYear === props.currentDate.getFullYear();

    const activityIsDone = props.dayInfo.day === day;
    const activityCount = props.dayActivityCounts[day] || 0;

    let backgroundColor = activityIsDone ? color : 'white';
    if (activityCount > 1) {
        backgroundColor = props.handleGradient();
    }

    const handleAddActivity = () => {
        if (props.dayInfo) {
            const day = props.dayInfo.day.toString().padStart(2, "0");
            const month = (props.currentDate.getMonth() + 1).toString().padStart(2, "0");
            const year = props.currentDate.getFullYear().toString();
            const formattedDate = `${day}.${month}.${year}`;
            navigate(`/calendar/add/${formattedDate}`);
        }
    };


    return (
        <li
            key={`day-${props.dayInfo.day}`}
            className={`calendar-day ${isActive ? "active" : ""}`}
        >
            <div className="day-circle" style={{ background: backgroundColor }}>{day}</div>

       
            <React.Fragment>
                <ButtonGroup variant="contained"  aria-label="split button" style={{ backgroundColor: 'transparent', color: 'black', marginTop: '-4rem', padding: 0, width: '3rem', height: '4.5rem' }}>
                    <Button
                        size="small"
                        style={{ backgroundColor: 'transparent', color: 'black', paddingTop: '3rem' }}
                        aria-controls='split-button-menu'
                        aria-label="select merge strategy"
                        aria-haspopup="menu"

                    >
                        <AddIcon style={{ fontSize: '20px' }}  onClick={handleAddActivity} />
                    </Button>
                </ButtonGroup>
        </React.Fragment>
        </li>
    );
}
