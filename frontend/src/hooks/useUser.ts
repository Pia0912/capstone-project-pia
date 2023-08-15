
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useSuccessMessage} from "./useSuccessMessage.tsx";

const api = axios.create({
    baseURL: '/api'
});

export default function useUser(){

    const [user, setUser] = useState<string>();
    const [userId, setUserId] = useState<string>();

    const { showSuccessMessage } = useSuccessMessage();

    const navigate = useNavigate();

    function me() {
        api.get('/user/me')
            .then(response => response.data)
            .catch(console.error)
            .then(data => setUser(data))

        api.get('/user')
            .then(response => response.data)
            .catch(console.error)
            .then(data => setUserId(data))
    }
    function handleLogin(username: string, password: string) {
        api.post("/user/login", null, {auth: {username, password}})
            .then(response => response.data)
            .catch(error => {
                console.error("Login error:", error);
            })
            .then(data => setUser(data))
        showSuccessMessage("Welcome " + username + " !");
        navigate("/api/hobbies");
    }


    function handleLogout() {
        api.post("/user/logout")
            .catch(console.error)
        setUser(undefined)
    }

    function handleRegister(username: string, password: string) {
        api.post("/user/register", {username: username, password: password})
            .catch(console.error)
        showSuccessMessage("Account register was successful!");
        navigate('/api/user/login')
    }

    return {me, user, userId, handleLogin, handleLogout, handleRegister}
}