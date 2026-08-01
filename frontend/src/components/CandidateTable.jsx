import { Link } from "react-router-dom";

function CandidateTable({
  candidates,
  onDelete,
}) {
  return (
    <div className="table-container">

      <table className="table">

        <thead>

          <tr>

            <th>ID</th>

            <th>Photo</th>

            <th>Name</th>

            <th>Party</th>

            <th>Symbol</th>

            <th>Manifesto</th>

            <th>Election ID</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {candidates.length === 0 ? (
            <tr>

              <td
                colSpan="8"
                className="no-data"
              >
                No Candidates Found
              </td>

            </tr>
          ) : (
            candidates.map((candidate) => (

              <tr key={candidate.id}>

                <td>{candidate.id}</td>

                <td>

                  {candidate.photo && (
                    <img
                      src={`http://localhost:5000/uploads/${candidate.photo}`}
                      alt={candidate.name}
                      width="70"
                    />
                  )}

                </td>

                <td>{candidate.name}</td>

                <td>{candidate.party}</td>

                <td>{candidate.symbol}</td>

                <td>{candidate.manifesto}</td>

                <td>{candidate.election_id}</td>

                <td>

                  <Link
                    to={`/edit-candidate/${candidate.id}`}
                  >
                    <button className="btn-edit">
                      Edit
                    </button>
                  </Link>

                  <button
                    className="btn-delete"
                    onClick={() => onDelete(candidate.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))
          )}

        </tbody>

      </table>

    </div>
  );
}

export default CandidateTable;