import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

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
      setMessage("Upload successful: " + response.data._id);
      setError("");
    } catch (error) {
      console.error("Upload failed", error); // Log the entire error object
      setError("Upload failed: " + error.response.data.message);
      setMessage("");
    }
  };

  return (
    <div className="upload-trip">
      <h2>Upload Trip</h2>
      <Form>
        <Form.Group controlId="formFile">
          <Form.Label>Choose a CSV file</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button variant="primary" onClick={handleUpload}>
          Upload Trip
        </Button>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
    </div>
  );
};

export default UploadTrip;
