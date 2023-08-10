import React, {useEffect, useState} from "react";
import {Activity, ActivityWithColor, Hobby} from "../models.ts";
import axios from "axios";



export default function useCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysArray, setDaysArray] = useState<Array<ActivityWithColor | null>>([]);
    const [activityNames, setActivityNames] = useState<string[]>([]);
    const [activityColors, setActivityColors] = useState<string[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedDayActivities, setSelectedDayActivities] = useState<ActivityWithColor[]>([]);

    const [open, setOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [hobbies, setHobbies] = useState<Hobby[]>([]);

    const anchorRef = React.useRef<HTMLDivElement>(null);


    useEffect(() => {
        function updateDaysArray(year: number, month: number, activitiesWithColors: Array<ActivityWithColor>) {
            const daysInMonth = getDaysInMonth(year, month);
            const firstDayOfMonth = getFirstDayOfMonth(year, month);
            const newDaysArray: Array<ActivityWithColor | null> = [];

            for (let i = 0; i < firstDayOfMonth; i++) {
                newDaysArray.push(null);
            }
            for (let day = 1; day <= daysInMonth; day++) {
                const activityInfo = activitiesWithColors.find((activity) => activity.day === day);
                newDaysArray.push(activityInfo ?? {
                    activityDate: "",
                    name: "",
                    color: "",
                    day,
                    hobbyId: "",
                    activityId: ""
                });
            }
            setDaysArray(newDaysArray);
        }

        axios
            .get<Array<ActivityWithColor>>(`/api/hobbies/calendar?month=${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-01`)
            .then((response) => {
                const activitiesWithColors = response.data.map((activity) => ({
                    ...activity,
                    day: new Date(activity.activityDate).getDate(),
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
    }, [currentDate]);

    useEffect(() => {
        const convertActivityToActivityWithColor = (activity: Activity): ActivityWithColor => {
            return {
                activityDate: activity.activityDate,
                name: activity.name,
                color: activity.color,
                day: new Date(activity.activityDate).getDate(),
                hobbyId: activity.hobbyId,
                activityId: activity.activityId,
            };
        };

        if (selectedDay !== null) {
            const selectedDayInfo = daysArray[selectedDay];
            if (selectedDayInfo) {
                const activitiesForSelectedDay = hobbies.reduce((selectedActivities, hobby) => {
                    const activities = hobby.activities.filter(activity =>
                        new Date(activity.activityDate).getDate() === selectedDayInfo.day &&
                        new Date(activity.activityDate).getMonth() === currentDate.getMonth()
                    );
                    const activitiesWithColor = activities.map(convertActivityToActivityWithColor);
                    return [...selectedActivities, ...activitiesWithColor];
                }, [] as ActivityWithColor[]);

                setSelectedDayActivities(activitiesForSelectedDay);
            }
        }
    }, [selectedDay, daysArray, currentDate, hobbies]);


    useEffect(() => {
        axios
            .get<Array<Hobby>>(`/api/hobbies`)
            .then((response) => {
                setHobbies(response.data);
                setActivityNames(response.data.map(activity => activity.name));
                setActivityColors(response.data.map(activity => activity.color));
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    const dayActivityCounts: { [key: number]: number } = {};
    daysArray.forEach(dayInfo => {
        if (dayInfo !== null) {
            dayActivityCounts[dayInfo.day] = hobbies.reduce((count, hobby) => {
                const activitiesForDay = hobby.activities.filter(activity =>
                    new Date(activity.activityDate).getDate() === dayInfo.day &&
                    new Date(activity.activityDate).getMonth() === currentDate.getMonth()
                );
                return count + activitiesForDay.length;
            }, 0);
        }
    });


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
            const newMonth = prevMonth < 0 ? 11 : prevMonth;


            return new Date(prevYear, newMonth, prevDate.getDate());
        });
    }

    function handleNextMonth() {
        setCurrentDate(prevDate => {
            const nextMonth = prevDate.getMonth() + 1;
            const nextYear = nextMonth > 11 ? prevDate.getFullYear() + 1 : prevDate.getFullYear();
            const newMonth = nextMonth > 11 ? 0 : nextMonth;
            return new Date(nextYear, newMonth, prevDate.getDate());
        });
    }


    const handleToggle = () => {
        if (activityNames.length > 0) {
            setOpen((prevOpen) => !prevOpen);
        }
    };

    const handleGradient = () => {
        if (activityColors.length > 1) {
            const gradientColors = activityColors.join(', ');
            return `linear-gradient(to bottom, ${gradientColors})`;
        } else if (activityColors.length === 1) {
            return activityColors[0];
        } else {
            return 'white';
        }
    };


    const handleClose = (event: Event) => {
        if (!anchorRef.current?.contains(event.target as HTMLElement)) {
            setOpen(false);
        }
    };

    const handleMenuItemClick = (index: number) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    return {
        currentDate,
        daysArray,
        activityNames,
        setSelectedDay,
        selectedDayActivities,
        open,
        selectedIndex,
        hobbies,
        anchorRef,
        handlePrevMonth,
        handleNextMonth,
        handleToggle,
        handleClose,
        handleMenuItemClick,
        dayActivityCounts,
    handleGradient}

}