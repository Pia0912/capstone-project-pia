import './Calendar.css';
import MonthHeader from './MonthHeader';
import Weekdays from './Weekdays';
import Day from './Day';
import useCalendar from "../../hooks/useCalendar.ts";

export default function Calendar() {
    const today = new Date();


    const {
        currentDate,
        daysArray,
        dayActivityCounts,
        setSelectedDay,
        selectedDayActivities,
        open,
        selectedIndex,
        anchorRef,
        handlePrevMonth,
        handleNextMonth,
        handleToggle,
        handleClose,
        handleMenuItemClick,
        handleGradient,
    } = useCalendar();

    return (
        <div className="calendar-container">
            <MonthHeader
                currentDate={currentDate}
                handlePrevMonth={handlePrevMonth}
                handleNextMonth={handleNextMonth}
            />
            <div className="calendar-content">
                <Weekdays />
                <ul className="days">
                    {daysArray.map((dayInfo, index) => (
                        <Day
                            key={index}
                            dayInfo={dayInfo}
                            currentDate={currentDate}
                            today={today}
                            dayActivityCounts={dayActivityCounts}
                            setSelectedDay={setSelectedDay}
                            selectedDayActivities={selectedDayActivities}
                            open={open}
                            selectedIndex={selectedIndex}
                            popperRef={anchorRef}
                            handleToggle={handleToggle}
                            handleClose={handleClose}
                            handleMenuItemClick={handleMenuItemClick}
                            handleGradient={handleGradient}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

