import Button from "@mui/material/Button";
import React, {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import styled from "@emotion/styled";
import MuiAlert, {AlertProps} from "@mui/material/Alert";
import {useSuccessMessage} from "../../hooks/useSuccessMessage.tsx";
import {useErrorMessage} from "../../hooks/useErrorMessage.ts";


type Props = {
    onLogin: (username: string, password: string) => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function LoginForm(props: Props) {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { successMessage, clearSuccessMessage } = useSuccessMessage();
    const { errorMessage, clearErrorMessage } = useErrorMessage();

    const navigate = useNavigate()

    function handleSubmit(event: FormEvent) {
        event.preventDefault()
        props.onLogin(username, password)
        navigate("/hobbies")
    }

    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (<>
            <Message>
                <h3>Greetings, returning friend!</h3>
                <h3>It's wonderful to have you here again!</h3>
            </Message>
            <form onSubmit={handleSubmit}>
                <fieldset style={{marginTop: '3rem'}}>
                    <legend style={{marginLeft: '-0.25rem', textAlign: 'center'}}>Please login here:</legend>
                    <div style={{display: 'flex', flexDirection: 'column', margin: 0, width: '300px'}}>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <StyledOutlinedInput
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                label="Username"
                                />
                        </FormControl>
                        <FormControl style={{marginTop: "30px"}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <StyledOutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            style={{marginTop: '-4.3rem', marginLeft: '10em'}}
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                />
                        </FormControl>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', gap: '1.5rem', justifyContent: 'space-between'}}>
                        <CancelButton variant="outlined" disableElevation onClick={() => navigate("/")}>
                            Cancel
                        </CancelButton>
                        <LoginButton type="submit" variant="contained">
                            Login
                        </LoginButton>
                    </div>
                </fieldset>
            </form>
            <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={clearSuccessMessage}>
                <StyledAlert onClose={clearSuccessMessage} severity="success">
                    {successMessage}
                </StyledAlert>
            </Snackbar>
            <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={clearErrorMessage}>
                <StyledAlert onClose={clearErrorMessage} severity="warning">
                    {errorMessage}
                </StyledAlert>
            </Snackbar>
        </>
    )
}

const Message = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: orange;
  box-shadow: 3px 3px black;
  font-size: 15px;
  border-radius: 10px;
  width: 270px;
`;

const StyledOutlinedInput = styled(OutlinedInput)`
  border-color: black;
  color: black;
  height: 70px;
  box-shadow: 3px 3px black;
`;

const LoginButton = styled(Button)`
  padding: 1.5rem;
  background-color: orange;
  border: 3px solid orange;
  color: white;
  height: 40px;
  width: 100px;
  border-radius: 5px;
  box-shadow: 3px 3px black;
  align-self: center;
  &:hover {
    background-color: darkorange;
  }
`;

const CancelButton = styled(Button)`
  padding: 1.5rem;
  border: 3px solid orange;
  color: black;
  height: 40px;
  width: 100px;
  border-radius: 5px;
  box-shadow: 3px 3px black;
  align-self: center;
  &:hover {
    border-color: darkorange;
  }
`;

const StyledAlert = styled(Alert)`
  margin-left: -2rem;
  margin-right: -2rem;
  width: 350px;
  align-self: center;
`;