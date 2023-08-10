import './Calendar.css';
import React from 'react';
import {ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper} from "@mui/material";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useCalendar from "../hooks/useCalendar.ts";


export default function Calendar() {
    const today = new Date();

    const {currentDate,
        daysArray,
        dayActivityCounts,
        setSelectedDay,
        selectedDayActivities,
        open,
        selectedIndex,
        anchorRef,
        handlePrevMonth, handleNextMonth,
        handleToggle, handleClose,
        handleMenuItemClick,
        handleGradient} = useCalendar();




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
                            return <li key={`empty-${index}`}></li>;
                        }

                        const { day, color } = dayInfo;
                        const currentDay = currentDate.getDate();
                        const currentMonth = currentDate.getMonth();
                        const currentYear = currentDate.getFullYear();

                        const isActive =
                            currentDay === day && currentMonth === today.getMonth() && currentYear === today.getFullYear();


                        const activityIsDone = dayInfo.day === day;
                        const activityCount = dayActivityCounts[day] || 0;

                        let backgroundColor = activityIsDone ? color : 'white';
                        if (activityCount > 1) {
                            backgroundColor = handleGradient();
                        }



                        return (
                            <li
                                key={`empty-${index}`}
                                className={`calendar-day ${isActive ? "active" : ""}`}
                                onClick={() => setSelectedDay(day)}
                            >
                                <div className="day-circle" style={{ background: backgroundColor }}>{day}</div>
                                <React.Fragment>
                                    <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" style={{ backgroundColor: 'transparent', color: 'black', marginTop: '-4rem', padding: 0, width: '3rem', height: '4.5rem' }}>
                                        {dayActivityCounts[day] > 0 ? (
                                            <Button
                                                size="small"
                                                style={{ backgroundColor: 'transparent', color: 'black', paddingTop: '3rem' }}
                                                aria-controls={open ? 'split-button-menu' : undefined}
                                                aria-expanded={open ? 'true' : undefined}
                                                aria-label="select merge strategy"
                                                aria-haspopup="menu"
                                                onClick={handleToggle}
                                            >
                                                <ArrowDropDownIcon style={{ fontSize: '20px' }} />
                                            </Button>
                                        ) : (
                                            <Button
                                                size="small"
                                                style={{ backgroundColor: 'transparent', color: 'transparent', paddingTop: '3rem' }}
                                                aria-controls={open ? 'split-button-menu' : undefined}
                                                aria-expanded={open ? 'true' : undefined}
                                                aria-label="select merge strategy"
                                                aria-haspopup="menu"
                                            >
                                                +
                                            </Button>
                                        )}
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
                                                <Paper style={{ backgroundColor: 'white', color: 'black', width: '350px' }}>
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
                                                                        style={{ backgroundColor: activity.color, width: '350px', margin: 0, padding: 0 }}
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

                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
