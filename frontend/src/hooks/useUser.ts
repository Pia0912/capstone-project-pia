
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useSuccessMessage} from "./useSuccessMessage.tsx";
import {useErrorMessage} from "./useErrorMessage.ts";

const api = axios.create({
    baseURL: '/api'
});

export default function useUser() {
    const [userName, setUserName] = useState<string>();
    const [userId, setUserId] = useState<string | undefined>(undefined);

    const { showSuccessMessage } = useSuccessMessage();
    const { showErrorMessage } = useErrorMessage();

    const navigate = useNavigate();

    useEffect(me, [me]);

    function me() {
        api.get('/user/me')
            .then(response => response.data)
            .then(data => setUserName(data))
            .catch(error => {
                console.error("Error fetching user data:", error);
                showErrorMessage("An error occurred, please reload page");
            });
    }

    function getUserId() {
        api.get('/user')
            .then(response => response.data)
            .then(data => setUserId(data))
            .catch(error => {
                console.error("Error fetching user ID:", error);
                showErrorMessage("An error occurred, please reload page");
            });
    }

    function handleLogin(username: string, password: string) {
        api.post("/user/login", null, { auth: { username, password } })
            .then(response => response.data)
            .catch(error => {
                console.error("Login error:", error);
                showErrorMessage("An error occurred while logging in");
            })
            .then((data) => {
                setUserName(data);
                getUserId();
                me();
                showSuccessMessage("Welcome " + username + " !");
                navigate("/hobbies");
            });
    }

    function handleLogout() {
        api.post("/user/logout")
            .then(() => {
                setUserName(undefined);
                setUserId(undefined);
                showSuccessMessage("Logout was successful!");
                navigate('/');
            })
            .catch((error) => {
                console.error("Logout error:", error);
                showErrorMessage("An error occurred while logging out");
            });
    }

    function handleRegister(username: string, password: string) {
        api.post("/user/register", { username: username, password: password })
            .catch((error) => {
                console.error("Logout error:", error);
                showErrorMessage("An error occurred while trying to register. Please try again with a different username");
                navigate('/');
            });
        showSuccessMessage("Account register was successful!");
        navigate('/login');
    }

    return { me, user: userName, userId, handleLogin, handleLogout, handleRegister };
}
