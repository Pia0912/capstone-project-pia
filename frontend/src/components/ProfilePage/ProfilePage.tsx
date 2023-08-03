import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import InfoIcon from '@mui/icons-material/Info';
import FlagIcon from '@mui/icons-material/Flag';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import Diversity1Icon from '@mui/icons-material/Diversity1';


export default function ProfilePage() {

    const navigate = useNavigate();
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (ref.current) {
            ref.current.ownerDocument.body.scrollTop = 0;
        }
    }, [value]);


    const handleInfoClick = () => {
        navigate("/profile/info");
    };

    const handleStatsClick = () => {
        navigate("/profile/stats");
    };

    const handleGoalsClick = () => {
        navigate("/profile/goals");
    };

    const handleSettingsClick = () => {
        navigate("/profile/settings");
    };

    const handleBadgesClick = () => {
        navigate("/profile/badges");
    };

    const handleFriendsClick = () => {
        navigate("/profile/friends");
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
                    <StyledSideNavigationAction label="Goals" onClick={handleGoalsClick}  icon={<FlagIcon />}/>
                    <StyledSideNavigationAction label="Settings" onClick={handleSettingsClick} icon={<SettingsApplicationsIcon />}/>
                    <StyledSideNavigationAction label="Badges" onClick={handleBadgesClick} icon={<MilitaryTechIcon />}/>
                    <StyledSideNavigationAction label="Friends" onClick={handleFriendsClick} icon={<Diversity1Icon />}/>
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
