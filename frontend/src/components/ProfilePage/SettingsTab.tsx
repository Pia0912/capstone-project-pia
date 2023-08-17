import styled from "@emotion/styled";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ProfilePage from "./ProfilePage.tsx";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from '@mui/icons-material/Logout';

type Props = {
    user: string | undefined;
    userId: string | undefined;
    onLogout: () => void;
}

export default function SettingsTab(props: Props) {

    const handleLogout = () => {
        props.onLogout();
    };

    return (
        <div className="div-settingsTab">
            <ProfilePage />
            <div id="settings" >
                <h2 className="tabTitle">Account Infos</h2>
                <div className="tabContent">
                    <SettingLabel>Username</SettingLabel>
                    <StyledIconButton>
                        <AccountCircleIcon />
                        {props.user}
                    </StyledIconButton>
                </div>

                <div className="tabContent">
                    <SettingLabel>User Id:</SettingLabel>
                    <StyledIconButton>
                        <AccountCircleIcon />
                        <UserId>{props.userId}</UserId>
                    </StyledIconButton>
                </div>
                <div className="tabContent">
                    <SettingLabel>Logout</SettingLabel>
                    <StyledIconButton onClick={handleLogout}>
                        <LogoutIcon />
                    </StyledIconButton>
                </div>
            </div>
        </div>
    );
}

const SettingLabel = styled.div`
  align-self: center;
  font-size: 1rem;
  margin-top: 1rem;
  margin-bottom: -0.5rem;
`;

const StyledIconButton = styled(IconButton)`
  background-color: orange;
  align-self: center;
  width: 10rem;
  color: black;
  border: 2px solid orange;
  border-radius: 5px;
  box-shadow: 3px 3px black;
  padding: 8px;
  &:hover {
    background-color: tomato;
    border: 2px solid tomato;
  }
`;

const UserId = styled.p`
  font-size: 10px;
`;
