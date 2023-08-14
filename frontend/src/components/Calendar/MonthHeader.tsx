
type Props = {
    currentDate: Date;
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
}

export default function MonthHeader(props: Props) {
    return (
        <div className="month">
            <ul className="buttons">
                <li className="prev" onClick={props.handlePrevMonth}>&#10094;</li>
                <li>
                    {props.currentDate.toLocaleString('default', { month: 'long' })}<br />
                    <span style={{ fontSize: '18px' }}>{props.currentDate.getFullYear()}</span>
                </li>
                <li className="next" onClick={props.handleNextMonth}>&#10095;</li>
            </ul>
        </div>
    );
}

