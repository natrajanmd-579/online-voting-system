import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CandidateForm from "../components/CandidateForm";

import {
  createCandidate,
} from "../services/candidateService";

import {
  getElections,
} from "../services/electionService";

function AddCandidate() {

  const navigate = useNavigate();

  const [elections, setElections] = useState([]);

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      const res = await getElections();
      setElections(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await createCandidate(formData);

      alert("Candidate Added Successfully");

      navigate("/candidates");

    } catch (err) {
      console.log(err);
      alert("Failed To Add Candidate");
    }
  };

  return (
    <div className="container">

      <CandidateForm
        elections={elections}
        onSubmit={handleSubmit}
      />

    </div>
  );
}

export default AddCandidate;