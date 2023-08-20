import './Calendar.css';
import MonthHeader from './MonthHeader';
import Weekdays from './Weekdays';
import Day from './Day';
import useCalendar from "../../hooks/useCalendar.ts";
import {DayInfo} from "../../models.ts";

type Props = {
    selectedDayActivities: DayInfo[];
    selectedIndex: number;
}
export default function Calendar(props: Props) {
    const today = new Date();


    const {
        currentDate,
        daysArray,
        dayActivityCounts,
        setSelectedDay,
        open,
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
            <div>
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
                            selectedDayActivities={props.selectedDayActivities}
                            open={open}
                            selectedIndex={props.selectedIndex}
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

