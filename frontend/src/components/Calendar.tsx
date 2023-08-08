import { useState, useEffect } from "react";
import axios from "axios";
import './Calendar.css';

type Props = {
    activityId?: string;
};

type ActivityWithColor = {
    activityId: string
    activityDate: string;
    color: string;
};

export default function Calendar({ activityId }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysArray, setDaysArray] = useState<Array<number | null | { day: number; color: string }>>([]);

    useEffect(() => {
        function updateDaysArray(year: number, month: number, activitiesWithColors: Array<{ day: number; color: string }>) {
            const daysInMonth = getDaysInMonth(year, month);
            const firstDayOfMonth = getFirstDayOfMonth(year, month);
            const newDaysArray: Array<number | null | { day: number; color: string }> = [];

            for (let i = 0; i < firstDayOfMonth; i++) {
                newDaysArray.push(null);
            }
            for (let day = 1; day <= daysInMonth; day++) {
                const activityInfo = activitiesWithColors.find((activity) => activity.day === day);
                newDaysArray.push(activityInfo || { day, color: "" });
            }
            setDaysArray(newDaysArray);
        }

        axios
            .get<Array<ActivityWithColor>>(`/api/hobbies/calendar?month=${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-01`)
            .then((response) => {
                const activitiesWithColors = response.data.map((activity) => ({
                    day: new Date(activity.activityDate).getDate(),
                    color: activity.color,
                }));

                updateDaysArray(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    activitiesWithColors
                );
            })
            .catch((error) => {
                console.error(error);
            });
    }, [currentDate, activityId]);

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

            <ul className="days" >
                {daysArray.map((dayInfo, index) => {
                    if (dayInfo === null) {
                        return <li key={index}></li>;
                    }

                    if (typeof dayInfo === 'number') {
                        return (
                            <li key={index}>
                                {dayInfo}
                            </li>
                        );
                    }

                    const { day, color } = dayInfo;
                    const isActive = currentDate.getDate() === day && currentDate.getMonth() === currentDate.getMonth();
                    const activityIsDone = dayInfo.day === day;

                    return (
                        <li
                            key={index}
                            className={isActive ? "active" : ""}
                            style={activityIsDone ? { backgroundColor: color, borderRadius: '50%' } : {}}
                        >
                            {day}
                        </li>
                    );
                })}
            </ul>

        </>
    );
}
