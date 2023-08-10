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
        <div className="div-infoTab">
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
        </div>
    );
}

const SettingsBar1 = styled.div`
  width: 250px;
  height: auto;
  align-items: center;
  align-self: flex-end;
  background-color: cornflowerblue;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 1.5rem;
  padding: 2rem;
  box-shadow: 3px 3px black;
`;

const SettingsBar = styled.div`
  width: 250px;
  height: auto;
  align-items: center;
  justify-content: space-around;
  background-color: tomato;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 2rem;
  box-shadow: 3px 3px black;
`;
