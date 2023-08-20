import React from "react";
import { ButtonGroup} from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router-dom";
import {DayInfo} from "../../models.ts";

type Props = {
    dayInfo: DayInfo | null;
    currentDate: Date;
    today: Date;
    setSelectedDay: (day: number) => void;
    selectedDayActivities: DayInfo[];
    open: boolean;
    selectedIndex: number;
    popperRef: React.RefObject<HTMLDivElement>;
    handleToggle: (event: React.MouseEvent<HTMLElement>) => void;
    handleClose: (event: Event) => void;
    handleMenuItemClick: (index: number) => void;
    handleGradient: () => string;
    dayActivityCounts: Record<number, number>;
}
export default function Day(props: Props) {
    const navigate = useNavigate();

    if (!props.dayInfo) {
        return <li></li>;
    }

    const { day, color } = props.dayInfo;
    const currentDay = props.currentDate.getDate();
    const currentMonth = props.currentDate.getMonth();
    const currentYear = props.currentDate.getFullYear();
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
                <ButtonGroup variant="contained" ref={props.popperRef} aria-label="split button" style={{ backgroundColor: 'transparent', color: 'black', marginTop: '-4rem', padding: 0, width: '3rem', height: '4.5rem' }}>
                    <Button
                        size="small"
                        style={{ backgroundColor: 'transparent', color: 'black', paddingTop: '3rem' }}
                        aria-controls='split-button-menu'
                        aria-expanded={props.open ? 'true' : 'false'}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={handleAddActivity}
                    >
                        <AddIcon style={{ fontSize: '20px' }} />
                    </Button>
                </ButtonGroup>

        </React.Fragment>
</li>
    );
}
