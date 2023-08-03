import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import ProfilePage from "./ProfilePage.tsx";

export default function SettingsTab() {
    return (
        <>
            <ProfilePage />
        <div id="settings" >
                <h3>Account Settings</h3>
                <div className="tabContent1">
                    <SettingLabel>Change Username</SettingLabel>
                    <SettingValue>JohnD123</SettingValue>
                </div>
                <div className="tabContent">
                    <SettingLabel>Email</SettingLabel>
                    <SettingValue>johndoe@example.com</SettingValue>
                </div>
                <div className="tabContent">
                    <SettingLabel>Change Password</SettingLabel>
                    <SettingButton>Change Password</SettingButton>
                </div>
        </div>
            </>
    );
}

const SettingLabel = styled.div`
  align-self: flex-start;
  font-size: 1rem;
  margin-right: 1rem;
  margin-top: 1rem;
`;

const SettingValue = styled.div`
  background-color: black;
  border-radius: 15px;
  margin-top: -1rem;
  font-size: 1rem;
  color: white;
`;

const SettingButton = styled(Button)`
  background-color: orange;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: orangered;
  }
`;