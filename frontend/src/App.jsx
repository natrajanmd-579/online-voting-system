import { Routes, Route, Navigate } from "react-router-dom";

import Elections from "./pages/Elections";
import AddElection from "./pages/AddElection";
import EditElection from "./pages/EditElection";

import Candidates from "./pages/Candidates";
import AddCandidate from "./pages/AddCandidate";
import EditCandidate from "./pages/EditCandidate";

function App() {
  return (
    <Routes>

      {/* Redirect */}

      <Route path="/" element={<Navigate to="/elections" />} />

      {/* Elections */}

      <Route
        path="/elections"
        element={<Elections />}
      />

      <Route
        path="/add-election"
        element={<AddElection />}
      />

      <Route
        path="/edit-election/:id"
        element={<EditElection />}
      />

      {/* Candidates */}

      <Route
        path="/candidates"
        element={<Candidates />}
      />

      <Route
        path="/add-candidate"
        element={<AddCandidate />}
      />

      <Route
        path="/edit-candidate/:id"
        element={<EditCandidate />}
      />

    </Routes>
  );
}

export default App;