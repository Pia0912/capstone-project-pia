export default function Weekdays() {
    const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    return (
        <ul className="weekdays">
            {weekdays.map((weekday) => (
                <li key={weekday}>{weekday}</li>
            ))}
        </ul>
    );
}

