import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Register from "./components/Register";
import MarkAttendance from "./components/MarkAttendance";
import AttendanceList from "./components/AttendanceList";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mark-attendance" element={<MarkAttendance />} />
          <Route path="/attendance-list" element={<AttendanceList />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
