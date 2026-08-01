import { useNavigate } from "react-router-dom";

import ElectionForm from "../components/ElectionForm";

import { createElection } from "../services/electionService";

function AddElection() {

  const navigate = useNavigate();

  const handleSubmit = async (formData) => {

    try {

      await createElection(formData);

      alert("Election Added Successfully");

      navigate("/elections");

    } catch (err) {

      console.log(err);

      alert("Failed to Add Election");

    }

  };

  return (

    <div className="container">

      <ElectionForm onSubmit={handleSubmit} />

    </div>

  );

}

export default AddElection;