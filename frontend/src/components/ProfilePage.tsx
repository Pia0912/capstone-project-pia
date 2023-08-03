import { useState } from "react";
import styled from "@emotion/styled";
import useHobbies from "../hooks/useHobbies.ts";
import useActivities from "../hooks/useActivities.ts";

interface TabProps {
    active: boolean;
    onClick: () => void;
}

export default function ProfilePage() {
    const { hobbies } = useHobbies();
    const data = useActivities();
    const [activeTab, setActiveTab] = useState("info"); // State to track active tab

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <>
            <ProfileHeader>
                <UserName>John Doe</UserName>
            </ProfileHeader>
            <ProfileTabs>
                <StyledTab onClick={() => handleTabClick("info")} active={activeTab === "info"}>
                    Info
                </StyledTab>
                <StyledTab onClick={() => handleTabClick("stats")} active={activeTab === "stats"}>
                    Stats
                </StyledTab>
                <StyledTab onClick={() => handleTabClick("goals")} active={activeTab === "goals"}>
                    Goals
                </StyledTab>
                <StyledTab onClick={() => handleTabClick("settings")} active={activeTab === "settings"}>
                    Settings
                </StyledTab>
                <StyledTab onClick={() => handleTabClick("badges")} active={activeTab === "badges"}>
                    Badges
                </StyledTab>
                <StyledTab onClick={() => handleTabClick("friends")} active={activeTab === "friends"}>
                    Friends
                </StyledTab>
            </ProfileTabs>

            {activeTab === "info" && (
                <ProgressContainer>
                    <ProgressTitle>Info</ProgressTitle>
                    <ProgressBar>
                        <ProgressLabel>{hobbies.length}</ProgressLabel>
                        <ProgressLabel>{data?.activities.length}</ProgressLabel>
                    </ProgressBar>
                </ProgressContainer>
            )}
            {activeTab === "stats" && (
                <SettingsContainer>
                    <SettingsTitle>Account Statistic</SettingsTitle>
                    <SettingOption>

                    </SettingOption>
                </SettingsContainer>
            )}

            {activeTab === "goals" && (
                <SettingsContainer>
                    <SettingsTitle>Goals</SettingsTitle>
                    <SettingOption>
                        <SettingLabel>Change Username</SettingLabel>
                        <SettingValue>JohnD123</SettingValue>
                    </SettingOption>
                    <SettingOption>
                        <SettingLabel>Email</SettingLabel>
                        <SettingValue>johndoe@example.com</SettingValue>
                    </SettingOption>
                    <SettingOption>
                        <SettingLabel>Change Password</SettingLabel>
                        <SettingButton>Change Password</SettingButton>
                    </SettingOption>
                </SettingsContainer>
            )}

            {activeTab === "settings" && (
                <SettingsContainer>
                    <SettingsTitle>Account Settings</SettingsTitle>
                    <SettingOption>
                        <SettingLabel>Change Username</SettingLabel>
                        <SettingValue>JohnD123</SettingValue>
                    </SettingOption>
                    <SettingOption>
                        <SettingLabel>Email</SettingLabel>
                        <SettingValue>johndoe@example.com</SettingValue>
                    </SettingOption>
                    <SettingOption>
                        <SettingLabel>Change Password</SettingLabel>
                        <SettingButton>Change Password</SettingButton>
                    </SettingOption>
                </SettingsContainer>
            )}

            {activeTab === "badges" && (
                <SettingsContainer>
                    <SettingsTitle>Badges</SettingsTitle>
                    <SettingOption>

                    </SettingOption>
                </SettingsContainer>
            )}

            {activeTab === "friends" && (
                <SettingsContainer>
                    <SettingsTitle>Friends</SettingsTitle>
                    <SettingOption>

                    </SettingOption>
                </SettingsContainer>
            )}
        </>
    );
}

const StyledTab = styled.div<TabProps>`
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 1rem;
  ${(props) => (props.active ? "background-color: #007bff; color: #fff;" : "")}
  &:last-child {
    margin-right: 0;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.h1`
  font-size: 2rem;
  margin-right: 1rem;
`;


const ProfileTabs = styled.div`
  display: flex;
  margin-top: 2rem;
`;


const ProgressContainer = styled.div`
  margin-top: 2rem;
`;

const ProgressTitle = styled.h2`
  font-size: 1.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 1rem;
`;

const ProgressLabel = styled.div`
  font-size: 1rem;
  margin-right: 1rem;
`;


const SettingsContainer = styled.div`
  margin-top: 2rem;
`;

const SettingsTitle = styled.h2`
  font-size: 1.5rem;
`;

const SettingOption = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const SettingLabel = styled.div`
  font-size: 1rem;
  margin-right: 1rem;
`;

const SettingValue = styled.div`
  font-size: 1rem;
  color: #555;
`;

const SettingButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #0056b3;
  }
`;
