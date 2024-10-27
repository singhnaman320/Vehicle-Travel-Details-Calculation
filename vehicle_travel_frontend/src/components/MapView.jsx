import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

const MapView = () => {
    const [tripData, setTripData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTripData = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get('/api/trips');
                setTripData(response.data);
            } catch (error) {
                console.error('Error fetching trip data:', error);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchTripData();
    }, []);

    if (loading) {
        return (
            <div className="loading-indicator">
                <Spinner animation="border" />
                <span>Loading trip data...</span>
            </div>
        );
    }

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {tripData && tripData.gpsData && (
                <Polyline positions={tripData.gpsData} color="blue" />
            )}
        </MapContainer>
    );
};

export default MapView;
