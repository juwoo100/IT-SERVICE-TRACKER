// frontend/src/App.jsx

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./components/Dashboard.jsx";
import TicketForm from "./components/TicketForm.jsx";
import TicketDetail from "./components/TicketDetail.jsx";
import Head from "./components/Head.jsx";
import Login from "./components/Login.jsx";

export default function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen text-gray-800">
        <Head />

        <div className="pt-20 px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets/:ticketId" element={<TicketDetail />} />
            <Route path="/new" element={<TicketForm />} />
            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
