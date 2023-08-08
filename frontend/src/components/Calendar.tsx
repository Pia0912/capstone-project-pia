import { useState, useEffect } from "react";
import './Calendar.css';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysArray, setDaysArray] = useState<Array<number | null>>([]);

    useEffect(() => {
        function updateDaysArray(year: number, month: number) {
            const daysInMonth = getDaysInMonth(year, month);
            const firstDayOfMonth = getFirstDayOfMonth(year, month);
            const newDaysArray: Array<number | null> = [];

            for (let i = 0; i < firstDayOfMonth; i++) {
                newDaysArray.push(null);
            }
            for (let day = 1; day <= daysInMonth; day++) {
                newDaysArray.push(day);
            }
            setDaysArray(newDaysArray);
        }
        updateDaysArray(currentDate.getFullYear(), currentDate.getMonth());
    }, [currentDate]);

    function getDaysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    function getFirstDayOfMonth(year: number, month: number): number {
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        return firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    }

    function handlePrevMonth() {
        setCurrentDate(prevDate => {
            const prevMonth = prevDate.getMonth() - 1;
            const prevYear = prevMonth < 0 ? prevDate.getFullYear() - 1 : prevDate.getFullYear();
            return new Date(prevYear, prevMonth, prevDate.getDate());
        });
    }

    function handleNextMonth() {
        setCurrentDate(prevDate => {
            const nextMonth = prevDate.getMonth() + 1;
            const nextYear = nextMonth > 11 ? prevDate.getFullYear() + 1 : prevDate.getFullYear();
            return new Date(nextYear, nextMonth, prevDate.getDate());
        });
    }

    return (
        <>
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
                {daysArray.map((day, index) => {
                    if (day === null) {
                        return <li key={index}></li>;
                    }
                    const isActive = currentDate.getDate() === day && currentDate.getMonth() === new Date().getMonth();
                    return (
                        <li
                            key={index}
                            className={isActive ? "active" : ""}
                            style={isActive ? { backgroundColor: "orangered" } : {}}
                        >
                            {day}
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
