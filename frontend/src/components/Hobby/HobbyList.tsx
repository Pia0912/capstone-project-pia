import { Hobby } from "../../models.ts";
import MuiAlert, {AlertProps} from "@mui/material/Alert";
import {Snackbar} from "@mui/material";
import React from "react";
import HobbyItem from "./HobbyItem.tsx";
import styled from "@emotion/styled";
import {useSuccessMessage} from "../../hooks/useSuccessMessage.tsx";
import {useErrorMessage} from "../../hooks/useErrorMessage.ts";

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
    const { errorMessage, clearErrorMessage } = useErrorMessage();

    if (!Array.isArray(props.hobbies)) {
        return <div className="div-hobbyList">Loading hobbies...</div>;
    }

    return (
        <>
        <Snackbar open={!!successMessage} autoHideDuration={2400} onClose={clearSuccessMessage}>
            <StyledAlert onClose={clearSuccessMessage} severity="success">
                {successMessage}
            </StyledAlert>
        </Snackbar>
        <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={clearErrorMessage}>
            <StyledAlert onClose={clearErrorMessage} severity="warning">
                {errorMessage}
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
  margin-left: -2rem;
  margin-right: -2rem;
  width: 350px;
  align-self: center;
`;
