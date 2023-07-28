import { useEffect, useState } from "react";
import './StarRating.css'

type StarRatingProps = {
    initialRating: number;
    onChange?: (newRating: number) => void;
};

const LOCAL_STORAGE_KEY = "starRating";

export default function StarRating(props: StarRatingProps) {
    const [rating, setRating] = useState<number>(() => {
        const storedRating = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedRating ? parseInt(storedRating, 10) : props.initialRating;
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, rating.toString());
    }, [rating]);

    const handleClick = (newRating: number) => {
        setRating(newRating);
        if (props.onChange) {
            props.onChange(newRating);
        }
    };

    return (
        <div
            className="ratingControl"
        >
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
