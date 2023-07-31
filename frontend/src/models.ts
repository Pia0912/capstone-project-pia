export type Hobby = {
    id: string;
    name: string;
    colors: string[];
    activities: Activity[];
};

export type HobbyWithoutID = {
    name: string;
};


export type Activity = {
    id: string;
    name: string;
    date: Date;
    hobbyId: string;
}

export type ActivityWithoutID = {
    name: string;
    date: Date;
    hobbyId: string;
}
