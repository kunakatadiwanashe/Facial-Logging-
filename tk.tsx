"use client";

import { useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import axios from "axios";

export default function Register() {
  const webcamRef = useRef<Webcam>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    try {
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    } catch (error) {
      console.error("Error loading face-api models:", error);
      alert("Failed to load face detection models.");
    }
  };

  const captureAndRegister = async () => {
    setLoading(true);
    try {
      await loadModels();
      if (!webcamRef.current || !webcamRef.current.video) {
        alert("Webcam not ready");
        setLoading(false);
        return;
      }
      const video = webcamRef.current.video;
      const detection = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const descriptor = Array.from(detection.descriptor);
        try {
          await axios.post("http://localhost:5000/api/auth/register", {
            name,
            email,
            studentId,
            faceDescriptor: descriptor,
          });
          alert("User Registered Successfully");
        } catch (postError) {
          console.error("Error registering user:", postError);
          alert("Failed to register user.");
        }
      } else {
        alert("No face detected");
      }
    } catch (error) {
      console.error("Error during face detection:", error);
      alert("Error during face detection.");
    } finally {
      setLoading(false);
    }
  };






  
  return (
    <>
      <form
        className="space-y-6 w-1/2 mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"
        onSubmit={(e) => {
          e.preventDefault();
          captureAndRegister();
        }}
      >
        <div>
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="name"
            name="name"
            placeholder="Enter your full name"
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="student_id"
          >
            Student ID
          </label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            id="student_id"
            name="student_id"
            pattern="[A-Za-z]{3}"
            title="Student ID should be 3 letters"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Face Capture
          </label>
          <div className="w-1/2 h-74 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden relative">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="object-cover w-full h-full"
              height={240}
              width={320}
            />
            <button
              className="absolute bottom-3 right-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="capture-button"
              type="button"
              onClick={captureAndRegister}
              disabled={loading}
            >
              <i className="fas fa-camera"></i> Capture
            </button>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Face"}
        </button>
      </form>
    </>
  );
}
