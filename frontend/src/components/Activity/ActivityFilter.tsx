import React from "react";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';

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

    React.useEffect(() => {
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
                <label htmlFor="search"><SearchIcon/> Activity:</label>
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
