import { Box, Heading, Text, Container } from "@chakra-ui/react";

function Home() {
  return (
    <Container maxW="container.md" py={10}>
      <Box textAlign="center">
        <Heading mb={6}>Face Recognition Attendance System</Heading>
        <Text fontSize="xl">
          Welcome to the facial recognition attendance system. Use the
          navigation above to register new users or mark attendance.
        </Text>
      </Box>
    </Container>
  );
}

export default Home;
