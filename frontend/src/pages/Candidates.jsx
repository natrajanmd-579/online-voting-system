import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CandidateTable from "../components/CandidateTable";

import {
  getCandidates,
  deleteCandidate,
} from "../services/candidateService";

function Candidates() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const res = await getCandidates();
      setCandidates(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load candidates");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;

    try {
      await deleteCandidate(id);
      loadCandidates();
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  return (
    <div className="container">

      <div className="page-header">

        <h1>Candidate Management</h1>

        <Link to="/add-candidate">
          <button>Add Candidate</button>
        </Link>

      </div>

      <CandidateTable
        candidates={candidates}
        onDelete={handleDelete}
      />

    </div>
  );
}

export default Candidates;