// hooks/useProfilePage.ts
import { useState, useEffect } from "react";
import { Hobby, Activity } from "../models"; // Import your types here

type ProfileData = {
    hobbies: Hobby[];
    activities: Activity[];
};

export function useProfilePage(): ProfileData {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                await fetchHobbies();
                await fetchActivitiesByMonth(new Date()); // Pass the desired month as a Date object
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    const fetchHobbies = async () => {
        try {
            const response = await fetch("/api/hobbies");
            const data = await response.json();
            setHobbies(data);
        } catch (error) {
            console.error("Error fetching hobbies:", error);
        }
    };

    const fetchActivitiesByMonth = async (month: Date) => {
        try {
            const response = await fetch(`/api/hobbies/calendar?month=${month.toISOString()}`);
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    return { hobbies, activities };
}
