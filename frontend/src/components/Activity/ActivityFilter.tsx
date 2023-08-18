import React, {useEffect} from "react";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';

type FilterProps = {
    onFilterChange: (filter: FilterData) => void;
};

export type FilterData = {
    date: string;
    hobby: string;
    search: string;
};

export default function ActivityFilter({ onFilterChange }: FilterProps) {
    const [filter, setFilter] = React.useState<FilterData>({
        date: "",
        hobby: "",
        search: "",
    });

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFilter((prevFilter) => ({
            ...prevFilter,
            [name]: value,
        }));
    };

    useEffect(() => {
        // Call the onFilterChange callback with the updated filter
        onFilterChange(filter);
    }, [filter, onFilterChange]);

    return (
        <div className="div-filter">
            <div className="filter-group">
                <label htmlFor="date"><CalendarMonthIcon/>Date:</label>
                <input
                    className="input-filter"
                    id="date"
                    type="date"
                    name="date"
                    value={filter.date}
                    onChange={handleFilterChange}
                />
            </div>
            <div className="filter-group">
                <label htmlFor="search"><LocalActivityIcon/> Activity:</label>
                <input
                    className="input-filter"
                    id="activity"
                    type="text"
                    name="search"
                    value={filter.search}
                    onChange={handleFilterChange}
                />
            </div>
        </div>
    );
}



