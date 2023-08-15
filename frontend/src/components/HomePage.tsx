import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import FiberPinIcon from "@mui/icons-material/FiberPin";

export default function HomePage() {

    const navigate = useNavigate();
    return(
        <>
            <CircleHeading>Welcome to Passion
                <FiberPinIcon className="header-icon" style={{fontSize: '50px', color: 'white', marginLeft: '-70px', paddingTop:'40px'}}/>!
                </CircleHeading>
            <p>If you already have an account, click the button below to login:</p>

                <Button variant="contained" color="primary" onClick={() => navigate(`/login` )}>
                    Login
                </Button>
            <p>If you don't have an account yet, click the button below to register:</p>
                <Button variant="outlined" color="primary" onClick={() => navigate(`/register` )}>
                    Register
                </Button>
        </>
    )
}


const CircleHeading = styled.h1`
  margin: 3rem;
  background-color: orange;
  border: 50px solid darkorange;
  color: white;
  font-size: 30px;
  border-radius: 50%;
  width: 250px;
  height: 250px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;
