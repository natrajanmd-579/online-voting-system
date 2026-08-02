import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CandidateForm from "../components/CandidateForm";
import Loader from "../components/ui/Loader";
import { getCandidateById, updateCandidate } from "../services/candidateService";
import { getElections } from "../services/electionService";

function EditCandidate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    const [elections, setElections] = useState([]);

    useEffect(() => {
        loadCandidate();
        getElections({ limit: 100 })
            .then((res) => setElections(res.data || []))
            .catch(() => toast.error("Failed to load elections"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadCandidate = async () => {
        try {
            const res = await getCandidateById(id);
            setCandidate(res.data);
        } catch (err) {
            toast.error("Failed to load candidate");
        }
    };

    const handleSubmit = async (formData) => {
        try {
            await updateCandidate(id, formData);
            toast.success("Candidate updated successfully");
            navigate("/candidates");
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    if (!candidate) return <Loader label="Loading candidate..." />;

    return (
        <div className="container">
            <div className="page-header">
                <h1>Edit Candidate</h1>
            </div>
            <CandidateForm elections={elections} initialData={candidate} onSubmit={handleSubmit} />
        </div>
    );
}

export default EditCandidate;
