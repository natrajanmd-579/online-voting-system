import { Routes, Route, Navigate } from "react-router-dom";

// Authentication
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // Main Dashboard Page
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

// Elections & Results
import Elections from "./pages/Elections";
import AddElection from "./pages/AddElection";
import EditElection from "./pages/EditElection";
import ElectionResults from "./components/ElectionResults"; // Added Results module

// Candidates
import Candidates from "./pages/Candidates";
import AddCandidate from "./pages/AddCandidate";
import EditCandidate from "./pages/EditCandidate";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Redirect */}
      <Route
        path="/home"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Election Routes */}
      <Route
        path="/elections"
        element={
          <ProtectedRoute>
            <Elections />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-election"
        element={
          <ProtectedRoute>
            <AddElection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-election/:id"
        element={
          <ProtectedRoute>
            <EditElection />
          </ProtectedRoute>
        }
      />

      {/* Results Route */}
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <ElectionResults />
          </ProtectedRoute>
        }
      />

      {/* Candidate Routes */}
      <Route
        path="/candidates"
        element={
          <ProtectedRoute>
            <Candidates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-candidate"
        element={
          <ProtectedRoute>
            <AddCandidate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-candidate/:id"
        element={
          <ProtectedRoute>
            <EditCandidate />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;