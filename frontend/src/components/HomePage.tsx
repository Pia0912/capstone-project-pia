import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import FiberPinIcon from "@mui/icons-material/FiberPin";

export default function HomePage() {

    const navigate = useNavigate();
    return(
        <>
            <CircleHeading>
                <Welcome>Welcome to Passion
                <FiberPinIcon className="header-icon" style={{fontSize: '50px', verticalAlign: 'middle'}}/>!
                </Welcome>
            </CircleHeading>

                <Login variant="contained" onClick={() => navigate(`/login` )}>
                    Login
                </Login>
            <Text>If you don't have an account yet, click the button below to register:</Text>
                <Register variant="outlined" onClick={() => navigate(`/register` )}>
                    Register
                </Register>
        </>
    )
}


const CircleHeading = styled.h1`
  margin: 3rem;
  background-color: orange;
  border: 50px solid darkorange;
  font-size: 30px;
  border-radius: 50%;
  width: 250px;
  height: 250px;
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
  font-size: 10px;
  width: 200px;
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
`;
