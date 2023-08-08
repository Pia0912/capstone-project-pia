import { useEffect, useState } from "react";
import axios from "axios";
import {Activity, Hobby} from "../models.ts";

const api = axios.create({
    baseURL: '/api'
});

export default function useCalendar() {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);

    function getDaysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    useEffect(() => {
        api.get("/hobbies")
            .then(response => response.data)
            .then(data => setHobbies(data))
            .catch(error => console.error("Error fetching hobbies:", error));
    }, []);

    const weeksArrayByHobby: (null | { day: number; activities: Activity[]; color: string })[][] = [];

    hobbies.forEach(hobby => {
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const daysInMonth = getDaysInMonth(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth());
        const firstDayWeekday = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

        let currentWeek: (null | { day: number; activities: Activity[]; color: string })[] = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayWeekday; i++) {
            currentWeek.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), day);
            const activitiesByDate = hobby.activities.filter(activity => {
                const activityDate = new Date(activity.activityDate);
                return activityDate.toISOString().split("T")[0] === currentDate.toISOString().split("T")[0];
            });

            const color = activitiesByDate.length > 0 ? activitiesByDate[0].color : hobby.color;

            currentWeek.push({ day, activities: activitiesByDate, color });

            if (currentWeek.length === 7) {
                weeksArrayByHobby.push(currentWeek);
                currentWeek = [];
            }
        }

        // Add remaining days in the last week
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }

        if (currentWeek.length > 0) {
            weeksArrayByHobby.push(currentWeek);
        }
    });

    return weeksArrayByHobby;
}
