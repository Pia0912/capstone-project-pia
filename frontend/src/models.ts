export type Hobby = {
    hobbyId: string;
    name: string;
    color: string;
    activities: Activity[];
};

export type HobbyWithoutID = {
    name: string;
    color: string;
};


export type Activity = {
    activityId: string;
    name: string;
    activityDate: string;
    hobbyId: string;
    rating: number;
    color: string;
}

export type ActivityWithoutID = {
    activityId?: string;
    name: string;
    activityDate: string;
    hobbyId: string;
    rating: number;
    color: string;
}


export type ActivityWithColor = {
    activityDate: string;
    name: string;
    color: string;
    day: number;
    hobbyId: string;
    activityId: string;
};

export type DayActivityCounts = {
    [day: number]: number;
};


export type DayInfo = {
    day: number;
    color: string;
    name: string;
    activityId: string;
};
