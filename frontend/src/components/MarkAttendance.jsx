import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  VStack,
  useToast,
  Text,
} from "@chakra-ui/react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { userService } from "../services/userService";
import { attendanceService } from "../services/attendanceService";

function MarkAttendance() {
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef(null);
  const toast = useToast();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadModels();
    fetchUsers();
  }, []);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const findBestMatch = (descriptor) => {
    return users.reduce((best, user) => {
      const distance = faceapi.euclideanDistance(
        descriptor,
        new Float32Array(user.faceDescriptor)
      );
      if (best === null || distance < best.distance) {
        return { user, distance };
      }
      return best;
    }, null);
  };

  const handleMarkAttendance = async () => {
    setIsLoading(true);

    try {
      const image = webcamRef.current.getScreenshot();
      const img = await faceapi.fetchImage(image);
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        toast({
          title: "No face detected",
          status: "error",
          duration: 3000,
        });
        return;
      }

      const match = findBestMatch(detection.descriptor);

      if (match && match.distance < 0.6) {
        const response = await attendanceService.markAttendance(match.user.id);

        if (response) {
          toast({
            title: "Attendance marked",
            description: `Welcome, ${match.user.name}!`,
            status: "success",
            duration: 3000,
          });
        }
      } else {
        toast({
          title: "User not recognized",
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error marking attendance",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6}>
        <Box width="100%" maxW="400px">
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width="100%" />
        </Box>
        <Button
          colorScheme="blue"
          onClick={handleMarkAttendance}
          isLoading={isLoading}
          width="100%"
          maxW="400px"
        >
          Mark Attendance
        </Button>
        <Text fontSize="sm" color="gray.500">
          Look at the camera and click the button to mark your attendance
        </Text>
      </VStack>
    </Container>
  );
}

export default MarkAttendance;
