import React from "react";
import {Popper, Grow, Paper, MenuItem, ClickAwayListener, MenuList, ButtonGroup} from '@mui/material';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styled from '@emotion/styled';
import {useNavigate} from "react-router-dom";

type DayInfo = {
    day: number;
    color: string;
    name: string;
    activityId: string;
};

type Props = {
    dayInfo: DayInfo | null;
    currentDate: Date;
    today: Date;
    setSelectedDay: (day: number) => void;
    selectedDayActivities: DayInfo[];
    open: boolean;
    selectedIndex: number;
    popperRef:  React.RefObject<HTMLDivElement>;
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
        currentDay === day && currentMonth === props.today.getMonth() && currentYear === props.today.getFullYear();

    const activityIsDone = props.dayInfo.day === day;
    const activityCount = props.dayActivityCounts[day] || 0;

    let backgroundColor = activityIsDone ? color : 'white';
    if (activityCount > 1) {
        backgroundColor = props.handleGradient();
    }

    return (
        <li
            key={`day-${props.dayInfo.day}`}
            className={`calendar-day ${isActive ? "active" : ""}`}
            onClick={() => props.setSelectedDay(day)}
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
                        onClick={props.handleToggle}
                    >
                        <ArrowDropDownIcon style={{ fontSize: '20px' }} />
                    </Button>
                </ButtonGroup>

                <Popper
                    sx={{
                        zIndex: 1,
                    }}
                    open={props.open}
                    anchorEl={props.popperRef.current}
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === 'bottom'
                                        ? 'center top'
                                        : 'center bottom',
                            }}
                        >
                            <Paper style={{ backgroundColor: 'white', color: 'black', width: '350px' }}>
                                <ClickAwayListener onClickAway={props.handleClose}>
                                    <MenuList
                                        id="split-button-menu"
                                        autoFocusItem
                                    >
                                        <StyledButtonAdd variant="contained" disableElevation onClick={() => navigate('/calendar/add')}>
                                            + add activity
                                        </StyledButtonAdd>
                                        {props.selectedDayActivities.map(
                                            (activity, index) => (
                                                <MenuItem
                                                    key={activity.activityId}
                                                    disabled={index === 2}
                                                    selected={index === props.selectedIndex}
                                                    onClick={() => props.handleMenuItemClick(index)}
                                                    sx={{ backgroundColor: activity.color, width: '350px', margin: 0, padding: 0 }}
                                                >
                                                    {activity.name}
                                                </MenuItem>
                                            )
                                        )}
                                        {props.selectedDayActivities.length === 0 && (
                                            <MenuItem sx={{ width: '350px', margin: 0, padding: 0 }}>
                                                No activities
                                            </MenuItem>
                                        )}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </React.Fragment>
        </li>
    );
}

const StyledButtonAdd = styled(Button)`
  background-color: black;
  font-size: 12px;
  margin-bottom: 2px;
`;

