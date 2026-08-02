import { Link } from "react-router-dom";
import StatusBadge from "./ui/StatusBadge";
import CountdownTimer from "./ui/CountdownTimer";

function ElectionTable({ elections, onDelete, onActivate, onEnd }) {
    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Candidates</th>
                        <th>Votes</th>
                        <th>Time Remaining</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {elections.map((election) => (
                        <tr key={election.id}>
                            <td>
                                <strong>{election.title}</strong>
                                <p className="cell-subtext">{election.description}</p>
                            </td>
                            <td><StatusBadge status={election.computed_status || election.status} /></td>
                            <td>{election.candidate_count ?? "-"}</td>
                            <td>{election.vote_count ?? "-"}</td>
                            <td>
                                {election.status === "completed" ? (
                                    "Ended"
                                ) : (
                                    <CountdownTimer target={election.end_date} doneLabel="Ended" />
                                )}
                            </td>
                            <td className="actions-cell">
                                <Link to={`/edit-election/${election.id}`}>
                                    <button className="btn btn-sm btn-secondary">Edit</button>
                                </Link>
                                <button className="btn btn-sm btn-danger" onClick={() => onDelete(election.id)}>
                                    Delete
                                </button>
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => onActivate(election.id)}
                                    disabled={election.status === "active"}
                                >
                                    Activate
                                </button>
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => onEnd(election.id)}
                                    disabled={election.status === "completed"}
                                >
                                    End
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ElectionTable;
