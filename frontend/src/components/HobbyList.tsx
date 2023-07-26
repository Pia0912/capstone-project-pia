import {Hobby} from "../models.ts";
import HobbyItem from "./HobbyItem.tsx";


type Props = {
    hobbies: Hobby[];
    colors: string[];
    onEditHobby: (hobbyId: string, newName: string) => void;
}
export default function HobbyList(props: Props) {
    return (
        <main>
            {props.hobbies.map(hobby => <HobbyItem hobby={hobby} key={hobby.id} colors={props.colors}
                                                   onEditHobby={props.onEditHobby}/>)}
        </main>
    );
}
