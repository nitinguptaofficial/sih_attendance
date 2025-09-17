import { Box, Flex, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <Box bg="blue.500" px={4} py={3}>
      <Flex justify="space-around">
        <ChakraLink as={Link} to="/" color="white">
          Home
        </ChakraLink>
        <ChakraLink as={Link} to="/register" color="white">
          Register
        </ChakraLink>
        <ChakraLink as={Link} to="/mark-attendance" color="white">
          Mark Attendance
        </ChakraLink>
        <ChakraLink as={Link} to="/attendance-list" color="white">
          Attendance List
        </ChakraLink>
      </Flex>
    </Box>
  );
}

export default Navigation;
