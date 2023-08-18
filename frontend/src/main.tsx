import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {SuccessMessage} from "./components/Messages/SuccessMessages.tsx";
import {ErrorMessages} from "./components/Messages/ErrorMessages.tsx";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <BrowserRouter>
          <SuccessMessage>
              <ErrorMessages>
              <App/>
              </ErrorMessages>
          </SuccessMessage>
      </BrowserRouter>
  </React.StrictMode>,
)
