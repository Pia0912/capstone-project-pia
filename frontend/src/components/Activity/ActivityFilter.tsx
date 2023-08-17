import React from "react";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import SearchIcon from '@mui/icons-material/Search';
import Button from "@mui/material/Button";
import styled from "@emotion/styled";

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
            <StyledButton onClick={() => onFilterChange(filter)}><SearchIcon/></StyledButton>
        </div>
    );
}


const StyledButton = styled(Button)`
  height: 50px;
  width: 50px;
  border-radius: 15px;
  margin-top: 2.7rem;
  background-color: black;
  color: white;
  font-size: 25px;
  &:hover {
    background-color: springgreen;
  }
`;
