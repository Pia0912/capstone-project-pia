import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {SuccessMessage} from "./components/SuccessMessages.tsx";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <BrowserRouter>
          <SuccessMessage>
              <App/>
          </SuccessMessage>
      </BrowserRouter>
  </React.StrictMode>,
)
