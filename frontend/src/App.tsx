import './App.css'
import {useEffect, useState} from "react";
import axios from "axios";
import HobbyList from "./components/HobbyList.tsx";
import {Hobby} from "./models.ts";
import Header from "./components/Header.tsx";

export default function App() {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);

  useEffect(() => {
    axios.get('api/hobbies')
        .then(response => response.data)
        .catch(console.error)
        .then(data => setHobbies(data))
  }, [])

  return (
      <>
      <Header/>
      <HobbyList hobbies={hobbies}/>
      </>
  )
}
