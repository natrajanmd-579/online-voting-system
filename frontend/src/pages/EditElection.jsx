import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import ElectionForm from "../components/ElectionForm";

import {
  getElectionById,
  updateElection,
} from "../services/electionService";

function EditElection() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [election, setElection] = useState(null);

  useEffect(() => {

    fetchElection();

  }, []);

  const fetchElection = async () => {

    try {

      const res = await getElectionById(id);

      setElection(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  const handleSubmit = async (formData) => {

    try {

      await updateElection(id, formData);

      alert("Election Updated Successfully");

      navigate("/elections");

    } catch (err) {

      console.log(err);

      alert("Update Failed");

    }

  };

  if (!election) return <h2>Loading...</h2>;

  return (

    <div className="container">

      <ElectionForm
        initialData={election}
        onSubmit={handleSubmit}
      />

    </div>

  );

}

export default EditElection;