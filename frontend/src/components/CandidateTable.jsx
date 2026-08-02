import { Link } from "react-router-dom";
import { getFileUrl } from "../api/axios";

function CandidateTable({ candidates, onDelete }) {
    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Party</th>
                        <th>Symbol</th>
                        <th>Election</th>
                        <th>Votes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate) => (
                        <tr key={candidate.id}>
                            <td>
                                {candidate.photo ? (
                                    <img
                                        src={getFileUrl(candidate.photo)}
                                        alt={candidate.name}
                                        className="candidate-thumb"
                                    />
                                ) : (
                                    <div className="candidate-thumb candidate-thumb-placeholder">
                                        {candidate.name[0]}
                                    </div>
                                )}
                            </td>
                            <td>{candidate.name}</td>
                            <td>{candidate.party}</td>
                            <td>{candidate.symbol}</td>
                            <td>{candidate.election_title}</td>
                            <td>{candidate.vote_count ?? 0}</td>
                            <td className="actions-cell">
                                <Link to={`/edit-candidate/${candidate.id}`}>
                                    <button className="btn btn-sm btn-secondary">Edit</button>
                                </Link>
                                <button className="btn btn-sm btn-danger" onClick={() => onDelete(candidate.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CandidateTable;
