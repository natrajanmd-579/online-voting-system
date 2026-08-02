import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

import Elections from "./pages/Elections";
import AddElection from "./pages/AddElection";
import EditElection from "./pages/EditElection";
import Results from "./pages/Results";

import Candidates from "./pages/Candidates";
import AddCandidate from "./pages/AddCandidate";
import EditCandidate from "./pages/EditCandidate";

import Vote from "./pages/Vote";

function App() {
  return (
    <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Core */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/vote" element={<ProtectedRoute><Vote /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/home" element={<Navigate to="/dashboard" replace />} />

        {/* Election management — admin only */}
        <Route path="/elections" element={<ProtectedRoute adminOnly><Elections /></ProtectedRoute>} />
        <Route path="/add-election" element={<ProtectedRoute adminOnly><AddElection /></ProtectedRoute>} />
        <Route path="/edit-election/:id" element={<ProtectedRoute adminOnly><EditElection /></ProtectedRoute>} />

        {/* Candidate management — admin only */}
        <Route path="/candidates" element={<ProtectedRoute adminOnly><Candidates /></ProtectedRoute>} />
        <Route path="/add-candidate" element={<ProtectedRoute adminOnly><AddCandidate /></ProtectedRoute>} />
        <Route path="/edit-candidate/:id" element={<ProtectedRoute adminOnly><EditCandidate /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default App;
