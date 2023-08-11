import { Hobby } from "../models";
import HobbyItem from "./HobbyItem";

type Props = {
    hobbies: Hobby[];
    colors: string[];
    onEditHobbyName: (hobbyId: string, newName: string) => void;
    onEditHobbyColor: (hobbyId: string, newColor: string) => void;
    onDeleteHobby: (hobbyId: string) => void;
};

export default function HobbyList(props: Props) {
    if (!Array.isArray(props.hobbies)) {
        return <div>Loading hobbies...</div>;
    }

    return (
        <div className="div-hobbyList">
            {props.hobbies.map((hobby) => (
                <HobbyItem
                    key={hobby.id}
                    hobby={hobby}
                    colors={props.colors}
                    onEditHobbyName={props.onEditHobbyName}
                    onEditHobbyColor={props.onEditHobbyColor}
                    onDeleteHobby={props.onDeleteHobby}
                />
            ))}
        </div>
    );
}
