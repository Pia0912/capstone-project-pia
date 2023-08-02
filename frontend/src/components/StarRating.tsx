import { useState, useEffect } from "react";

type StarRatingProps = {
    activityId: string;
    initialRating: number;
    onChange?: (newRating: number) => void;
};

export const LOCAL_STORAGE_KEY = "starRating";

export default function StarRating(props: StarRatingProps) {
    const [rating, setRating] = useState<number>(() => {
        const storedRating = localStorage.getItem(`${props.activityId}_${LOCAL_STORAGE_KEY}`);
        return storedRating ? parseInt(storedRating, 10) : props.initialRating;
    });

    useEffect(() => {
        localStorage.setItem(`${props.activityId}_${LOCAL_STORAGE_KEY}`, rating.toString());
        if (props.onChange) {
            props.onChange(rating);
        }
    }, [props.activityId, rating]);

    const handleClick = (newRating: number) => {
        setRating(newRating);
    };

    return (
        <div className="ratingControl">
            {[1, 2, 3, 4, 5].map((index) => (
                <label
                    key={index}
                    style={{
                        cursor: 'pointer',
                        color: index <= rating ? '#ffbf00' : '#ccc',
                    }}
                    onClick={() => handleClick(index)}
                >
                    ★
                </label>
            ))}
        </div>
    );
}
