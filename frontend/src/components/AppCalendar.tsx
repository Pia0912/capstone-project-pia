import { useState } from 'react';
import Calendar from 'react-calendar';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function AppCalendar() {
    const [value, onChange] = useState<Value>(new Date());

    return (
        <div>
            <Calendar onChange={onChange} value={value} />
        </div>
    );
}
