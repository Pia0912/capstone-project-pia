import React, {useState} from "react";
import {ButtonGroup, Menu, MenuItem} from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router-dom";
import {ActivityWithColor} from "../../models.ts";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styled from "@emotion/styled";

type Props = {
    dayInfo: ActivityWithColor | null;
    currentDate: Date;
    today: Date;
    handleGradient: () => string;
    dayActivityCounts: Record<number, number>;
    selectedDayActivities: ActivityWithColor[];
    setSelectedDay: (day: number | null) => void;
}
export default function Day(props: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        props.setSelectedDay(props.dayInfo?.day ?? null);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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

    console.log(props.selectedDayActivities)


    return (
        <li
            key={`day-${props.dayInfo.day}`}
            className={`calendar-day ${isActive ? "active" : ""}`}
        >
            <div
                className="day-circle"
                style={{ background: backgroundColor }}
                onClick={handleClick}
            >
                {day}
            </div>

            <React.Fragment>
                <StyledButtonGroup
                    variant="contained"
                    aria-label="split button"
                >
                    <StyledButtonAdd
                        size="small"
                        onClick={handleAddActivity}
                    >
                        <AddIcon style={{ fontSize: "20px" }} />
                    </StyledButtonAdd>
                    <StyledButtonList
                        id="demo-positioned-button"
                        aria-controls={open ? "demo-positioned-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                    >
                        <ArrowDropDownIcon style={{ fontSize: "20px" }} />
                    </StyledButtonList>
                </StyledButtonGroup>
                <Menu
                    id="demo-positioned-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    {props.selectedDayActivities.map(
                        (activity) => (<MenuItem
                                onClick={handleClose}
                                key={activity.activityId}
                                value={activity.activityId}
                                sx={{ backgroundColor: activity.color}}
                            >
                                {activity.name}
                            </MenuItem>
                        ))
                   }
                </Menu>
            </React.Fragment>
        </li>
    );
}

const StyledButtonAdd = styled(Button)`
  background-color: transparent;
  color: black;
  padding-top: 3rem;
  margin-left: -0.4rem;
  &:hover {
    background-color: transparent;
    color: red;
    border: none;
  }
`;

const StyledButtonList = styled(Button)`
  background-color: transparent;
  color: black;
  padding-top: 3rem;
  margin-left: -1rem;
  &:hover {
    background-color: transparent;
    color: red;
    border: none;
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  margin-top: -4rem;
  padding: 0;
  width: 3rem;
  height: 4.5rem;
  flex-direction: row;

  .MuiButtonGroup-grouped:not(:last-of-type) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
    border-color: #1565c0;
  }
`;
