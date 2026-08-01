import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ElectionTable from "../components/ElectionTable";

import {
  getElections,
  deleteElection,
  activateElection,
  endElection,
} from "../services/electionService";

function Elections() {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      const res = await getElections();
      setElections(res.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load elections");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this election?")) return;

    await deleteElection(id);
    loadElections();
  };

  const handleActivate = async (id) => {
    await activateElection(id);
    loadElections();
  };

  const handleEnd = async (id) => {
    await endElection(id);
    loadElections();
  };

  return (
    <div className="container">

      <div className="page-header">
        <h1>Election Management</h1>

        <Link to="/add-election">
          <button>Add Election</button>
        </Link>
      </div>

      <ElectionTable
        elections={elections}
        onDelete={handleDelete}
        onActivate={handleActivate}
        onEnd={handleEnd}
      />

    </div>
  );
}

export default Elections;