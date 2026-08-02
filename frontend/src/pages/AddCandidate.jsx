import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CandidateForm from "../components/CandidateForm";
import { createCandidate } from "../services/candidateService";
import { getElections } from "../services/electionService";

function AddCandidate() {
    const navigate = useNavigate();
    const [elections, setElections] = useState([]);

    useEffect(() => {
        getElections({ limit: 100 })
            .then((res) => setElections(res.data || []))
            .catch(() => toast.error("Failed to load elections"));
    }, []);

    const handleSubmit = async (formData) => {
        try {
            await createCandidate(formData);
            toast.success("Candidate added successfully");
            navigate("/candidates");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add candidate");
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Add Candidate</h1>
            </div>
            <CandidateForm elections={elections} onSubmit={handleSubmit} />
        </div>
    );
}

export default AddCandidate;
