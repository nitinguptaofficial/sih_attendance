import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Container,
  Select,
} from "@chakra-ui/react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { userService } from "../services/userService";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    loadModels();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const image = webcamRef.current.getScreenshot();
      const img = await faceapi.fetchImage(image);
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        toast({
          title: "No face detected",
          status: "error",
          duration: 3000,
        });
        return;
      }

      const faceDescriptor = Array.from(detections.descriptor);

      const response = await userService.register({
        name,
        email,
        role,
        faceDescriptor: JSON.stringify(faceDescriptor),
      });

      if (response) {
        toast({
          title: "Registration successful",
          status: "success",
          duration: 3000,
        });
        setName("");
        setEmail("");
        setRole("student");
      }
    } catch (error) {
      toast({
        title: "Registration failed",
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
        <Box as="form" width="100%" maxW="400px" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Role</FormLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </Select>
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={isLoading}
            >
              Register
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default Register;
