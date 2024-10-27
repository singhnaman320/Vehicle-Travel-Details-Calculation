import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


// "@testing-library/jest-dom": "^5.17.0",
// "@testing-library/react": "^13.4.0",
// "@testing-library/user-event": "^13.5.0",
// "axios": "^1.7.7",
// "leaflet": "^1.9.4",
// "react": "^18.3.1",
// "react-dom": "^18.3.1",
// "react-leaflet": "^4.2.1",
// "react-router-dom": "^6.27.0",
// "react-scripts": "^5.0.1",
// "web-vitals": "^2.1.4"