import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navigation from "./components/Navigation";

// Lazy load components
const Home = lazy(() => import("./components/Home"));
const Register = lazy(() => import("./components/Register"));
const MarkAttendance = lazy(() => import("./components/MarkAttendance"));
const AttendanceList = lazy(() => import("./components/AttendanceList"));

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Navigation />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mark-attendance" element={<MarkAttendance />} />
            <Route path="/attendance-list" element={<AttendanceList />} />
          </Routes>
        </Suspense>
      </Router>
    </ChakraProvider>
  );
}

export default App;
