import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'remixicon/fonts/remixicon.css'
import './index.css'
import App from './App.jsx'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AppContextProvider from "./context/AppContextProvider";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContextProvider>
    <App />
  </AppContextProvider>
  </StrictMode>,
)
