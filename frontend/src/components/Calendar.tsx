import { useState } from "react";
import './Calendar.css';

export default function ActivityCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    function getDaysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    function getFirstDayOfMonth(year: number, month: number): number {
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        return firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust to start the week on Monday (0 for Monday, 6 for Sunday)
    }

    function days(year: number, month: number): Array<number | null> {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);
        const daysArray: Array<number | null> = [];

        // Push null values for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push(null);
        }

        // Push the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            daysArray.push(day);
        }

        return daysArray;
    }

    const daysArray = days(currentDate.getFullYear(), currentDate.getMonth());

    function handlePrevMonth() {
        setCurrentDate(prevDate => {
            const prevMonth = prevDate.getMonth() - 1;
            const prevYear = prevMonth < 0 ? prevDate.getFullYear() - 1 : prevDate.getFullYear();
            return new Date(prevYear, prevMonth);
        });
    }

    function handleNextMonth() {
        setCurrentDate(prevDate => {
            const nextMonth = prevDate.getMonth() + 1;
            const nextYear = nextMonth > 11 ? prevDate.getFullYear() + 1 : prevDate.getFullYear();
            return new Date(nextYear, nextMonth);
        });
    }

return (
        <>
            <div className="month">
                <ul>
                    <li className="prev" onClick={handlePrevMonth}>&#10094;</li>
                    <li className="next" onClick={handleNextMonth}>&#10095;</li>
                    <li>
                        {currentDate.toLocaleString('default', { month: 'long' })}<br />
                        <span style={{ fontSize: '18px' }}>{currentDate.getFullYear()}</span>
                    </li>
                </ul>
            </div>

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
                {daysArray.map((day, index) => (
                    <li key={index} className={currentDate.getDate() === day ? "active" : ""}>
                        {day !== null ? day : ""}
                    </li>
                ))}
            </ul>
        </>
    );
}
