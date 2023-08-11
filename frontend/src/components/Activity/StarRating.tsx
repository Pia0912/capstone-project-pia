import { useEffect, useState } from "react";

type StarRatingProps = {
    activityId: string;
    initialRating: number;
    onChange?: (newRating: number) => void;
};

export default function StarRating({ initialRating, onChange }: StarRatingProps) {
    const [rating, setRating] = useState(initialRating);

    useEffect(() => {
        if (onChange) {
            onChange(rating);
        }
    }, [rating, onChange]);

    const handleClick = (newRating: number) => {
        setRating(newRating);
        if (onChange) {
            onChange(newRating);
        }
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
