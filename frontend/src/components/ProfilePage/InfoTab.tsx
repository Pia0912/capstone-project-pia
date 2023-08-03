import {Hobby} from "../../models.ts";
import styled from "@emotion/styled";
import ProfilePage from "./ProfilePage.tsx";

type InfoTabProps = {
    hobbies: Hobby[];

}
export default function InfoTab(props: InfoTabProps) {
    return (
        <>
        <ProfilePage />
        <div id="info" className="tabContent">
                <h3>Info</h3>
                <SettingsBar>
                    <h6>Number of Activities: {props.hobbies.length}</h6>
                    <h6>Number of Activities: </h6>
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