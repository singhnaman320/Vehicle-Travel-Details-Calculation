import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import { useLocation } from "react-router-dom";

const MapView = () => {
  const location = useLocation();
  const { selectedTripId } = location.state || {}; // Retrieve the selected trip ID
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tripDetail, setTripDetail] = useState(null);

  useEffect(() => {
    const fetchTripData = async () => {
      if (!selectedTripId) {
        console.warn("No trip ID selected.");
        setTripData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Fetch the trip data using the selectedTripId
        const response = await axios.get(`/api/trips/${selectedTripId}`, {
          headers: {
            authorization: `Bearer ${token}`, // Replace with the appropriate header based on your API
          },
        });
        console.log("API Response:", response.data);

        const data = response.data;

        if (data && data.gpsData) {
          setTripData(data);
          const detail = calculateTripDetail(data);
          setTripDetail(detail);
          console.log("Trip Detail:", detail);
        } else {
          console.warn("No valid trip data returned.");
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [selectedTripId]);

  // Calculate trip details like total distance and duration
  const calculateTripDetail = (trip) => {
    let totalDistance = 0;
    let totalTime = 0;

    for (let i = 1; i < trip.gpsData.length; i++) {
      const prevPoint = trip.gpsData[i - 1];
      const currentPoint = trip.gpsData[i];

      const distance = getDistance(
        { latitude: prevPoint.latitude, longitude: prevPoint.longitude },
        { latitude: currentPoint.latitude, longitude: currentPoint.longitude }
      );

      const timeDiff =
        (new Date(currentPoint.timestamp) - new Date(prevPoint.timestamp)) /
        1000;
      totalDistance += distance;
      totalTime += timeDiff;
    }

    return {
      tripId: trip._id,
      totalDistance: totalDistance / 1000,
      totalTime: totalTime / 3600,
    };
  };

  // Function to calculate distance between two points
  const getDistance = (point1, point2) => {
    const R = 6371e3;
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Function to calculate speed and create polylines
  const getPolylineWithSpeed = (gpsData) => {
    const segments = [];
    for (let i = 1; i < gpsData.length; i++) {
      const prevPoint = gpsData[i - 1];
      const currentPoint = gpsData[i];
      const distance = getDistance(
        { latitude: prevPoint.latitude, longitude: prevPoint.longitude },
        { latitude: currentPoint.latitude, longitude: currentPoint.longitude }
      );

      const timeDiff =
        (new Date(currentPoint.timestamp) - new Date(prevPoint.timestamp)) /
        3600000; // hours
      const speed = timeDiff ? distance / 1000 / timeDiff : 0; // km/h

      const color = speed > 60 ? "cyan" : "blue"; // Customize color based on speed
      segments.push({
        positions: [
          [prevPoint.latitude, prevPoint.longitude],
          [currentPoint.latitude, currentPoint.longitude],
        ],
        color,
      });
    }
    return segments;
  };

  // Calculate the map center based on the first point of the trip
  const mapCenter =
    tripData && tripData.gpsData.length > 0
      ? [tripData.gpsData[0].latitude, tripData.gpsData[0].longitude]
      : [51.505, -0.09];

  if (loading) {
    return (
      <div className="loading-indicator">
        <Spinner animation="border" />
        <span>Loading trip data...</span>
      </div>
    );
  }

  return (
    <div>
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {tripData &&
          getPolylineWithSpeed(tripData.gpsData).map((segment, idx) => (
            <Polyline
              key={idx}
              positions={segment.positions}
              color={segment.color}
            />
          ))}
      </MapContainer>

      {tripDetail && (
        <div className="trip-details mb-20 text-center">
          <h5>Trip ID: {tripDetail.tripId}</h5>
          <p>Total Distance: {tripDetail.totalDistance.toFixed(2)} km</p>
          <p>Total Duration: {tripDetail.totalTime.toFixed(2)} hours</p>
        </div>
      )}
    </div>
  );
};

export default MapView;
