import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import UploadTrip from './components/UploadTrip';
import MapView from './components/MapView';
import { BrowserRouter  } from 'react-router-dom';
import Register from './components/Register';
const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" index element={<Login />} />
            <Route path="/register" index element={<Register />} />
            <Route path="/upload" element={<UploadTrip />} />
            <Route path="/map" element={<MapView />} />
        </Routes>
        </BrowserRouter>
);

export default App;
