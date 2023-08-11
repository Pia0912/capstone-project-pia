export type Hobby = {
    id: string;
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
