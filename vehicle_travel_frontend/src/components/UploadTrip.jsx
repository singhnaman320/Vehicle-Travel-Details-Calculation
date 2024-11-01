import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Alert, Card, Container, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "../style/UploadTrip.css";
import illustrationLogo from "../assets/illustration.png";

const UploadTrip = () => {
  const [file, setFile] = useState(null);
  const [tripName, setTripName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [trips, setTrips] = useState([]); // Store uploaded trips
  const [showModal, setShowModal] = useState(false);
  const { userId, token } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("/api/trips");
        setTrips(response.data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tripName", tripName);
    try {
      const response = await axios.post("/api/trips/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
      setMessage("CSV file uploaded successfully");
      setError("");
      setTrips([...trips, response.data]);
      setFile(null);
      setTripName("");
      setShowModal(false);
      document.getElementById("formFile").value = "";
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Upload failed", error);
      setError("Upload failed: Check upload of your CSV file");
      setMessage("");
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await axios.delete(`/api/trips/${tripId}`);
      setTrips(trips.filter((trip) => trip._id !== tripId));
      setMessage("Trip deleted successfully");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error deleting trip:", error);
      setError("Error deleting trip");
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <div>
      <div style={{ minHeight: "50px" }}>
        {error && (
          <Alert variant="danger" className="mt-3 text-center">
            {error}
          </Alert>
        )}
        {message && (
          <Alert variant="success" className="mt-3 text-center">
            {message}
          </Alert>
        )}
      </div>
      <Container className="upload-trip-container mt-4 d-flex flex-column align-items-center">
        <Card className="text-left w-75">
          <Card.Header className="bg-light w-1200">
            <h5
              className="mb-0"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "16px",
                letterSpacing: "0.01em",
                textAlign: "left",
              }}
            >
              👋 Welcome, User
            </h5>
          </Card.Header>
          <Card.Body>
            <div
              className="upload-illustration mb-3"
              style={{ position: "relative", top: "15px" }}
            >
              <img
                src={illustrationLogo}
                alt="Illustration of map upload"
                className="img-fluid"
              />
            </div>
            <div
              className="d-flex justify-content-center mt-5"
              style={{ position: "relative", top: "10px" }}
            >
              <Button
                variant="dark"
                className="upload-button mb-2"
                onClick={() => setShowModal(true)} // Open modal
              >
                Upload Trip
              </Button>
            </div>

            <p
              className="text-muted text-center"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "16px",
                letterSpacing: "0.01em",
                textAlign: "left",
                position: "relative",
                top: "10px",
              }}
            >
              Upload the Excel sheet of your trip
            </p>
          </Card.Body>
        </Card>
      </Container>

      {/* Modal for file upload */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          {/* <Modal.Title >Upload Trip</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="tripName">
              <Form.Label
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "16px",
                  letterSpacing: "0.01em",
                  textAlign: "left",
                }}
              >
                Trip Name
              </Form.Label>
              <Form.Control
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group
              controlId="formFile"
              className="mt-3"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "16px",
                letterSpacing: "0.01em",
                textAlign: "left",
              }}
            >
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "16px",
              letterSpacing: "0.01em",
              textAlign: "left",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="dark"
            onClick={handleUpload}
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "16px",
              letterSpacing: "0.01em",
              textAlign: "left",
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Your Trips Section */}
      <Container className="mt-4">
        <h5>Your Trips</h5>
        <div className="trip-list">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="d-flex justify-content-between align-items-center"
            >
              <span>{trip.tripName}</span>
              <div>
                <Button variant="link" className="me-2">
                  Open
                </Button>
                <Button
                  variant="link"
                  className="text-danger"
                  onClick={() => handleDeleteTrip(trip._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default UploadTrip;
