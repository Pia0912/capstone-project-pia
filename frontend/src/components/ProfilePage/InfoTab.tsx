import styled from "@emotion/styled";
import ProfilePage from "./ProfilePage.tsx";
import useHobbies from "../../hooks/useHobbies.ts";
export default function InfoTab() {
    const { hobbies } = useHobbies();

    function countActivitiesForHobby(hobbyId: string) {
        const hobby = hobbies.find((hobby) => hobby.id === hobbyId);
        if (!hobby) {
            return 0;
        }
        return hobby.activities.length;
    }

    return (
        <>
            <ProfilePage />
            <div id="info" className="tabContent">
                <h2 className="tabTitle">Info</h2>
                <SettingsBar1>
                    <h6>Number of Hobbies: {hobbies.length}</h6>
                </SettingsBar1>
                <SettingsBar>
                    {hobbies.map((hobby) => (
                        <h6 key={hobby.id}>
                            Activities for {hobby.name}: {countActivitiesForHobby(hobby.id)}
                        </h6>
                    ))}
                </SettingsBar>
            </div>
        </>
    );
}

const SettingsBar1 = styled.div`
  width: 300px;
  height: auto;
  align-items: center;
  justify-content: space-around;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin: 2rem;
  padding: 2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const SettingsBar = styled.div`
  width: 300px;
  height: 100px;
  align-items: center;
  justify-content: space-around;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin: 2rem;
  padding: 2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;
