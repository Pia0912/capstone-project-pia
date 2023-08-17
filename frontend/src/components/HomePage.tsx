import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import FiberPinIcon from "@mui/icons-material/FiberPin";
import useUser from "../hooks/useUser.ts";
import React from "react";
import MuiAlert, {AlertProps} from "@mui/material/Alert";
import {Snackbar} from "@mui/material";
import {useSuccessMessage} from "../hooks/useSuccessMessage.tsx";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function HomePage() {
    const { successMessage, clearSuccessMessage } = useSuccessMessage();
    const {user} = useUser();

    const navigate = useNavigate();
    return(
        <>
            <CircleHeading>
                <Welcome>Welcome to Passion
                <FiberPinIcon className="header-icon" style={{fontSize: '50px', verticalAlign: 'middle'}}/>!
                </Welcome>
            </CircleHeading>

            <Text>Hello {user}. If you already have an account, please click LOGIN - if not please click REGISTER:</Text>
            <div style={{display:'flex', flexDirection:'row', gap: '1.5rem', justifyContent: 'space-between'}}>
                <Login variant="contained" onClick={() => navigate(`/login` )}>
                    Login
                </Login>
           <Register variant="outlined" onClick={() => navigate(`/register` )}>
                    Register
                </Register>
            </div>
            <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={clearSuccessMessage}>
                <StyledAlert onClose={clearSuccessMessage} severity="success">
                    {successMessage}
                </StyledAlert>
            </Snackbar>
        </>
    )
}


const CircleHeading = styled.div`
  margin: 3rem;
  background-color: orange;
  border: 50px solid darkorange;
  font-size: 30px;
  border-radius: 50%;
  width: 250px;
  height: 220px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const Welcome = styled.h1`
  margin-left: -1rem;
  font-size: 30px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.p`
  font-size: 14px;
  width: 350px;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: -0.5rem;
`;


const Login = styled(Button)`
  margin: 1rem;
  background-color: orange;
  border: 3px solid orange;
  color: white;
  height: 70px;
  width: 100px;
  border-radius: 5px;
  box-shadow: 3px 3px black;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: darkorange;
  }
`;

const Register = styled(Button)`
  margin: 1rem;
  border: 3px solid orange;
  color: black;
  height: 70px;
  width: 100px;
  border-radius: 5px;
  box-shadow: 3px 3px black;
  align-items: center;
  justify-content: center;
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
