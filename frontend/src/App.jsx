import { useState, useEffect } from 'react'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Dashboard from './components/Dashboard.jsx'
import TicketList from './components/TicketList.jsx'
import TicketForm from './components/TicketForm.jsx'
import TicketDetail from './components/TicketDetail.jsx'
import Head from './components/Head.jsx'
import Login from './components/Login.jsx'


export default function App() {
const [message, setMessage] = useState('');
  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.text()) // Get the response as text
      .then((data) => setMessage(data)) // Set the message state
      .catch((err) => console.log(err)); // Log any errors
  }, []); // Empty dependency array to run only once on mount 

  return (
    <Router>
      <div>
        <Head />
<p>{message}</p>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/tickets' element={<TicketList />} />
          <Route path='/tickets/:ticketId' element={<TicketDetail />} />
          <Route path='/new' element={<TicketForm />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}
