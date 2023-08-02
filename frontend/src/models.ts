export type Hobby = {
    id: string;
    name: string;
    color: string;
    activities: Activity[];
};

export type HobbyWithoutID = {
    name: string;
};


export type Activity = {
    activityId: string;
    name: string;
    date: Date;
    hobbyId: string;
    rating: number;
}

export type ActivityWithoutID = {
    name: string;
    date?: Date;
    hobbyId: string;
    rating: number;
}
