import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Alert, Card, Container, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../style/UploadTrip.css";
import illustrationLogo from "../assets/illustration.png";

const UploadTrip = () => {
  const [file, setFile] = useState(null);
  const [tripName, setTripName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { userId, token } = useAuth();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [tripsPerPage] = useState(10); // 10 trips per page

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("/api/trips", {
          headers: { authorization: `Bearer ${token}` },
        });
        setTrips(response.data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    fetchTrips();
  }, [token]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

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
      setTrips([...trips, response.data]);
      setFile(null);
      setTripName("");
      setShowModal(false);
      document.getElementById("formFile").value = "";
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("Upload failed", error);
      setError("Upload failed: Check upload of your CSV file");
      setTimeout(() => setError(""), 2000);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await axios.delete(`/api/trips/${tripId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setTrips(trips.filter((trip) => trip._id !== tripId));
      setMessage("Trip deleted successfully");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("Error deleting trip:", error);
      setError("Error deleting trip");
      setTimeout(() => setError(""), 2000);
    }
  };

  const navigate = useNavigate();
  const handleOpenMap = () => {
    navigate("/map");
  };

  // Pagination logic
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = trips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(trips.length / tripsPerPage);

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
          <Card.Header
            className="bg-light w-1200 mb-0"
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
          </Card.Header>
          <Card.Body>
            <div
              className="upload-illustration mb-3"
              style={{ position: "relative", top: "15px" }}
            >
              <img
                src={illustrationLogo}
                alt="Illustration"
                className="img-fluid mb-3"
              />
            </div>
            <div
              className="d-flex justify-content-center mt-5"
              style={{ position: "relative", top: "10px" }}
            >
              <Button variant="dark" onClick={() => setShowModal(true)}>
                Upload Trip
              </Button>
            </div>
            <p
              className="text-muted text-center mt-2"
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton />
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

      <Container className="mt-4">
        <h5
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.01em",
            textAlign: "left",
          }}
        >
          Your Trips
        </h5>
        <div className="trip-list">
          {currentTrips.map((trip) => (
            <div
              key={trip._id}
              className="d-flex justify-content-between align-items-center"
            >
              <span>{trip.tripName}</span>
              <div>
                <Button
                  variant="link"
                  className="text-success"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "16px",
                    letterSpacing: "0.01em",
                    textAlign: "left",
                    textDecoration: "none",
                    border: "2px solid green",
                    marginRight: "5px",
                    marginTop: "10px"
                  }}
                  onClick={handleOpenMap}
                >
                  Open
                </Button>
                <Button
                  variant="link"
                  className="text-danger"
                  onClick={() => handleDeleteTrip(trip._id)}
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "16px",
                    letterSpacing: "0.01em",
                    textAlign: "left",
                    textDecoration: "none",
                    border: "2px solid red",
                    marginTop: "10px"
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        <div className="pagination mt-3 justify-content-center mb-3">
          <Button
            variant="outline-secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline-secondary"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default UploadTrip;
