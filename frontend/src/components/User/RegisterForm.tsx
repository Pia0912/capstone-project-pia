import Button from "@mui/material/Button";
import React, {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput,} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import styled from "@emotion/styled";


type Props = {
    onRegister: (username: string, password: string) => void
}

export default function RegisterForm(props: Props) {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorUsername, setErrorUsername] = useState<string>("");
    const [errorPassword, setErrorPassword] = useState<string>("");

    const navigate = useNavigate()

    function handleSubmit(event: FormEvent) {
        event.preventDefault()
        props.onRegister(username, password)
    }

    function changeUsername(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value)
        if (event.target.value.includes(" ")) {
            setErrorUsername("Whitespace is not allowed!")
        } else if (event.target.value.length < 3) {
            setErrorUsername("Username must be at least 3 characters long!")
        } else if (event.target.value.length > 25) {
            setErrorUsername("Username must be under 25 characters long!")
        } else {
            setErrorUsername("")
        }
    }


    function changePassword(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value)
        if (event.target.value.length < 3) {
            setErrorPassword("Password must be at least 3 characters long!")
        } else if (event.target.value.length > 25) {
            setErrorPassword("Password must be under 25 characters long!")
        } else {
            setErrorPassword("")
        }
    }

    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (<>
            <Message>
            <h3>Hello and welcome!</h3>
            <h3>Get ready for an incredible journey with us. </h3>
            </Message>
                <form onSubmit={handleSubmit}>
                <fieldset style={{marginTop: '3rem'}}>
                    <legend style={{marginLeft: '-0.25rem', textAlign: 'center'}}>Please register here:</legend>
                    <div style={{display: 'flex', flexDirection: 'column', margin: 0, width: '300px'}}>
                        <FormControl variant="outlined"
                                     error={errorUsername.length > 0}>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <StyledOutlinedInput
                                type="text"
                                value={username}
                                id="username"
                                onChange={changeUsername}
                                label="Username"
                                />
                            {errorUsername && <FormHelperText error>{errorUsername}</FormHelperText>}
                        </FormControl>
                        <FormControl style={{marginTop: "30px"}} variant="outlined"
                                     error={errorPassword.length > 0}>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <StyledOutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={changePassword}
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
                            {errorPassword && <FormHelperText error>{errorPassword}</FormHelperText>}
                        </FormControl>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', gap: '1.5rem', justifyContent: 'space-between'}}>
                        <CancelButton
                            variant="outlined" disableElevation
                            onClick={() => navigate("/")}>
                            Cancel
                        </CancelButton>
                        <RegisterButton type="submit" variant="contained">
                            Sign up
                        </RegisterButton>
                    </div>
                </fieldset>
            </form>
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

const RegisterButton = styled(Button)`
  padding: 1.5rem;
  background-color: orange;
  border: 3px solid orange;
  color: white;
  height: 40px;
  width: 120px;
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
  width: 120px;
  border-radius: 5px;
  box-shadow: 3px 3px black;
  align-self: center;
  &:hover {
    border-color: darkorange;
  }
`;
