import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  VStack,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";

function AttendanceList() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, [startDate, endDate]);

  const fetchAttendance = async () => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get("http://localhost:5000/api/attendance", {
        params,
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={6}>
        <Heading>Attendance Records</Heading>

        <VStack width="100%" spacing={4}>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </VStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {attendanceData.map((record) => (
              <Tr key={record._id}>
                <Td>{record.userId.name}</Td>
                <Td>{record.userId.role}</Td>
                <Td>{new Date(record.date).toLocaleDateString()}</Td>
                <Td>{new Date(record.date).toLocaleTimeString()}</Td>
                <Td>{record.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Container>
  );
}

export default AttendanceList;
