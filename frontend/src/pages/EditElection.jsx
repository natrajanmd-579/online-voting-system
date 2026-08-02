import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ElectionForm from "../components/ElectionForm";
import Loader from "../components/ui/Loader";
import { getElectionById, updateElection } from "../services/electionService";

function EditElection() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [election, setElection] = useState(null);

    useEffect(() => {
        fetchElection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchElection = async () => {
        try {
            const res = await getElectionById(id);
            setElection(res.data);
        } catch (err) {
            toast.error("Failed to load election");
        }
    };

    const handleSubmit = async (formData) => {
        try {
            await updateElection(id, formData);
            toast.success("Election updated successfully");
            navigate("/elections");
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    if (!election) return <Loader label="Loading election..." />;

    return (
        <div className="container">
            <div className="page-header">
                <h1>Edit Election</h1>
            </div>
            <ElectionForm initialData={election} onSubmit={handleSubmit} />
        </div>
    );
}

export default EditElection;
