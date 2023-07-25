import {Hobby} from "../models.ts";
import HobbyItem from "./HobbyItem.tsx";


type Props= {
    hobbies: Hobby[]
}
export default function HobbyList(props: Props) {
    return (
        <ul>
            {props.hobbies.map(hobby => <HobbyItem hobby={hobby} key={hobby.id}/>)}
        </ul>
    );
}
