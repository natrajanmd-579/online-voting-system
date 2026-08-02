import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ElectionForm from "../components/ElectionForm";
import { createElection } from "../services/electionService";

function AddElection() {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            await createElection(formData);
            toast.success("Election added successfully");
            navigate("/elections");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add election");
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Add Election</h1>
            </div>
            <ElectionForm onSubmit={handleSubmit} />
        </div>
    );
}

export default AddElection;
