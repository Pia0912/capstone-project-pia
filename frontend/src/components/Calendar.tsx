import './Calendar.css';
import React from 'react';
import {ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper} from "@mui/material";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useCalendar from "../hooks/useCalendar.ts";

export default function Calendar() {
    const {currentDate, daysArray, activityNames,
        setSelectedDay,selectedDayActivities, open, selectedIndex,
        anchorRef, handlePrevMonth, handleNextMonth, handleToggle, handleClose, handleMenuItemClick,} = useCalendar();

    return (
        <div className="calendar-container">
            <div className="month">
                <ul className="buttons">
                    <li className="prev" onClick={handlePrevMonth}>&#10094;</li>
                    <li>
                        {currentDate.toLocaleString('default', { month: 'long' })}<br />
                        <span style={{ fontSize: '18px' }}>{currentDate.getFullYear()}</span>
                    </li>
                    <li className="next" onClick={handleNextMonth}>&#10095;</li>
                </ul>
            </div>

            <div className="calendar-content">
                <ul className="weekdays">
                    <li>Mo</li>
                    <li>Tu</li>
                    <li>We</li>
                    <li>Th</li>
                    <li>Fr</li>
                    <li>Sa</li>
                    <li>Su</li>
                </ul>

                <ul className="days">
                    {daysArray.map((dayInfo, index) => {
                        if (dayInfo === null) {
                            return <li key={index}></li>;
                        }

                        const { day, color } = dayInfo;

                        const isActive = currentDate.getDate() === day && currentDate.getMonth() === currentDate.getMonth();
                        const activityIsDone = dayInfo.day === day;

                        const backgroundColor = activityIsDone ? color : 'white';

                        return (
                            <li
                                key={index}
                                className={isActive ? "active" : ""}
                                style={{ background: backgroundColor, borderRadius: '50%', cursor: 'pointer' }}
                                onClick={() => setSelectedDay(day)}
                            >
                                <div>{day}</div>
                                <div style={{ display: 'inline-block', marginLeft: '4px', backgroundColor: 'transparent' }}>
                                    {activityNames.length > 0 && (
                                        <React.Fragment>
                                            <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                                                <Button
                                                    style={{ backgroundColor: 'transparent', color: 'black', margin: 0, padding: 0 }}
                                                    size="small"
                                                    aria-controls={open ? 'split-button-menu' : undefined}
                                                    aria-expanded={open ? 'true' : undefined}
                                                    aria-label="select merge strategy"
                                                    aria-haspopup="menu"
                                                    onClick={handleToggle}
                                                >
                                                    <ArrowDropDownIcon style={{ fontSize: '15px' }} />
                                                </Button>
                                            </ButtonGroup>
                                            <Popper
                                                sx={{
                                                    zIndex: 1,
                                                }}
                                                open={open}
                                                anchorEl={anchorRef.current}
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
                                                        <Paper style={{ backgroundColor: 'white', color: 'black', width: '250px' }}>
                                                            <ClickAwayListener onClickAway={handleClose}>
                                                                <MenuList
                                                                    id="split-button-menu"
                                                                    autoFocusItem
                                                                >
                                                                    {selectedDayActivities.map(
                                                                        (activity, index) => (
                                                                            <MenuItem
                                                                                key={activity.activityId}
                                                                                disabled={index === 2}
                                                                                selected={index === selectedIndex}
                                                                                onClick={() => handleMenuItemClick(index)}
                                                                                style={{ backgroundColor: activity.color, width: '250px' }}
                                                                            >
                                                                                {activity.name}
                                                                            </MenuItem>
                                                                        )
                                                                    )}
                                                                </MenuList>
                                                            </ClickAwayListener>
                                                        </Paper>
                                                    </Grow>
                                                )}
                                            </Popper>
                                        </React.Fragment>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}