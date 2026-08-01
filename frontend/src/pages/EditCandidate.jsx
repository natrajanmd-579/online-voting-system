import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import CandidateForm from "../components/CandidateForm";

import {
  getCandidateById,
  updateCandidate,
} from "../services/candidateService";

import {
  getElections,
} from "../services/electionService";

function EditCandidate() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [candidate, setCandidate] = useState({});

  const [elections, setElections] = useState([]);

  useEffect(() => {

    loadCandidate();

    loadElections();

  }, []);

  const loadCandidate = async () => {

    try {

      const res = await getCandidateById(id);

      setCandidate(res.data);

    } catch (err) {

      console.log(err);

    }

  };

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

      await updateCandidate(id, formData);

      alert("Candidate Updated Successfully");

      navigate("/candidates");

    } catch (err) {

      console.log(err);

      alert("Update Failed");

    }

  };

  if (!candidate.id) {

    return <h2>Loading...</h2>;

  }

  return (

    <div className="container">

      <CandidateForm
        elections={elections}
        initialData={candidate}
        onSubmit={handleSubmit}
      />

    </div>

  );

}

export default EditCandidate;