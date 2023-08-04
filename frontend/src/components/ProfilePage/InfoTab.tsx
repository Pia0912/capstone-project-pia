import {Activity, Hobby} from "../../models.ts";
import styled from "@emotion/styled";
import ProfilePage from "./ProfilePage.tsx";

type InfoTabProps = {
    hobbies: Hobby[];
    activities: Activity[];

}
export default function InfoTab(props: InfoTabProps) {

    console.log("Activities:", props.activities);
    function countActivitiesForHobby(hobbyId: string): number {
        if (!props.activities) {
            return 0;
        }
        return props.activities.filter(
            (activity) => activity.hobbyId === hobbyId
        ).length;
    }

    return (
        <>
        <ProfilePage />
        <div id="info" className="tabContent">
            <h2 className="tabTitle">Info</h2>
                <SettingsBar>
                    <h6>Number of Hobbies: {props.hobbies.length}</h6>
                    {props.hobbies.map((hobby) => (
                        <h6 key={hobby.id}>
                            {hobby.name}: {countActivitiesForHobby(hobby.id)}
                        </h6>

                    ))}
                </SettingsBar>
        </div>
        </>
    );
}

const SettingsBar = styled.div`
  width: 300px;
  height: 100px;
  align-items: center;
  justify-content: space-around;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 2rem;
  margin-left: 2rem;
`;
