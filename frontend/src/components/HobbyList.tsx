import { Hobby } from "../models";
import MuiAlert, {AlertProps} from "@mui/material/Alert";
import {Snackbar} from "@mui/material";
import React from "react";
import HobbyItem from "./HobbyItem";
import styled from "@emotion/styled";
import {useSuccessMessage} from "./SuccessMessages.tsx";

type Props = {
    hobbies: Hobby[];
    colors: string[];
    onEditHobbyName: (hobbyId: string, newName: string) => void;
    onEditHobbyColor: (hobbyId: string, newColor: string) => void;
    onDeleteHobby: (hobbyId: string) => void;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function HobbyList(props: Props) {
    const { successMessage, clearSuccessMessage } = useSuccessMessage();

    if (!Array.isArray(props.hobbies)) {
        return <div>Loading hobbies...</div>;
    }

    return (
        <>
        <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={clearSuccessMessage}>
            <StyledAlert onClose={clearSuccessMessage} severity="success">
                {successMessage}
            </StyledAlert>
        </Snackbar>
        <div className="div-hobbyList">
            {props.hobbies.map((hobby) => (
                <HobbyItem
                    key={hobby.hobbyId}
                    hobby={hobby}
                    colors={props.colors}
                    onEditHobbyName={props.onEditHobbyName}
                    onEditHobbyColor={props.onEditHobbyColor}
                    onDeleteHobby={props.onDeleteHobby}
                />
            ))}
        </div>
        </>
    );
}

const StyledAlert = styled(Alert)`
  background-color: darkorange;
  color: black;
  width: 100%;
`;
