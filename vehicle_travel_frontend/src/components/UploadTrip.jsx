import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Alert, Card, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "../style/UploadTrip.css"; // Add this CSS file for custom styles if needed
import illustrationLogo from "../assets/illustration.png";

const UploadTrip = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { userId, token } = useAuth(); // Access `userId` and `token` from context

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("/api/trips/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      // response.data._id
      setMessage("CSV file uploaded successfully");
      setError("");
      setFile(null); // Clear the file input
      document.getElementById("formFile").value = ""; // Clear the file input field
      setTimeout(() => {
        setMessage(""); // Clear the success message after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Upload failed", error); // Log the entire error object
      // error.response.data.message
      setError("Upload failed: Check upload of your CSV file");
      setMessage("");
      setTimeout(() => {
        setError(""); // Clear the error message after 2 seconds
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
              <Form className="mt-3 w-75 d-flex justify-content-center">
                <Form.Group controlId="formFile" className="w-100">
                  <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
              </Form>
            </div>

            <div
              className="d-flex justify-content-center mt-5"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "16px",
                letterSpacing: "0.01em",
                textAlign: "left",
              }}
            >
              <Button
                variant="dark"
                className="upload-button mb-2"
                onClick={handleUpload}
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
    </div>
  );
};

export default UploadTrip;
