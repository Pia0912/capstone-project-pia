import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import ProfilePage from "./ProfilePage.tsx";
import PasswordIcon from '@mui/icons-material/Password';
import IconButton from "@mui/material/IconButton";

type Props = {
    user: string | undefined;
}

export default function SettingsTab(props: Props) {


    return (
        <div className="div-settingsTab">
            <ProfilePage />
            <div id="settings" >
                <h2 className="tabTitle">Account Settings</h2>
                <div className="tabContent1">
                    <SettingLabel>Username</SettingLabel>
                    <SettingButton>{props.user}</SettingButton>
                </div>

                <div className="tabContent">
                    <SettingLabel>Password</SettingLabel>
                    <StyledIconButton>
                        <PasswordIcon />
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
`;


const SettingButton = styled(Button)`
  background-color: orange;
  align-self: center;
  width: 10rem;
  color: black;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: tomato;
  }
`;

const StyledIconButton = styled(IconButton)`
  background-color: orange;
  align-self: center;
  width: 10rem;
  color: black;
  border: 2px solid orange;
  border-radius: 5%; 
  padding: 8px;
  &:hover {
    background-color: tomato;
    border: 2px solid tomato;
  }
`;