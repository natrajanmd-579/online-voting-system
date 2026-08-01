import { Link } from "react-router-dom";

function ElectionTable({
  elections,
  onDelete,
  onActivate,
  onEnd,
}) {
  return (
    <div className="table-container">
      <table className="table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {elections.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
                No Elections Found
              </td>
            </tr>
          ) : (
            elections.map((election) => (
              <tr key={election.id}>

                <td>{election.id}</td>

                <td>{election.title}</td>

                <td>{election.description}</td>

                <td>{election.start_date}</td>

                <td>{election.end_date}</td>

                <td>{election.status}</td>

                <td>

                  <Link to={`/edit-election/${election.id}`}>
                    <button className="btn-edit">
                      Edit
                    </button>
                  </Link>

                  <button
                    className="btn-delete"
                    onClick={() => onDelete(election.id)}
                  >
                    Delete
                  </button>

                  <button
                    className="btn-active"
                    onClick={() => onActivate(election.id)}
                  >
                    Activate
                  </button>

                  <button
                    className="btn-end"
                    onClick={() => onEnd(election.id)}
                  >
                    End
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

export default ElectionTable;