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
        handlePrevMonth,
        handleNextMonth,
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
                            handleGradient={handleGradient}
                            dayActivityCounts={dayActivityCounts}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

