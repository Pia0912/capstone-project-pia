import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

export default function HomePage() {

    const navigate = useNavigate();
    return(
        <>
            <h1>Welcome to Our Hobby App!</h1>
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