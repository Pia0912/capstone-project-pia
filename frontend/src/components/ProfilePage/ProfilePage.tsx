import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import {useState} from "react";
import InfoIcon from '@mui/icons-material/Info';
import InsightsIcon from '@mui/icons-material/Insights';

export default function ProfilePage() {

    const navigate = useNavigate();
    const [value, setValue] = useState(0);

    const handleInfoClick = () => {
        navigate("/profile/info");
    };

    const handleStatsClick = () => {
        navigate("/profile/stats");
    };

    const handleSettingsClick = () => {
        navigate("/profile/settings");
    };


    return (

            <StyledSidePaper elevation={10}>
                <StyledSideNavigation
                    showLabels
                    value={value}
                    onChange={(_, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <StyledSideNavigationAction label="Info" onClick={handleInfoClick} icon={<InfoIcon />}/>
                    <StyledSideNavigationAction label="Stats" onClick={handleStatsClick} icon={<InsightsIcon />}/>
                    <StyledSideNavigationAction label="Settings" onClick={handleSettingsClick} icon={<InsightsIcon />}/>

                </StyledSideNavigation>
            </StyledSidePaper>
    );
}

const StyledSidePaper = styled(Paper)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  height: 105%;
  width: 3.5rem;
  background-color: black;
  justify-content: space-around;
`;

const StyledSideNavigation = styled(BottomNavigation)`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  align-items: center;
  height: 70%;
  width: 3.5rem;
  background-color: black;
`;

const StyledSideNavigationAction = styled(BottomNavigationAction)`
 color: white;
`;
