import { useState, useEffect } from "react";

function CandidateForm({
  elections = [],
  initialData = {},
  onSubmit,
}) {
  const [form, setForm] = useState({
    election_id: "",
    name: "",
    party: "",
    symbol: "",
    manifesto: "",
    photo: null,
  });

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setForm({
        election_id: initialData.election_id || "",
        name: initialData.name || "",
        party: initialData.party || "",
        symbol: initialData.symbol || "",
        manifesto: initialData.manifesto || "",
        photo: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setForm({
        ...form,
        photo: files[0],
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("election_id", form.election_id);
    formData.append("name", form.name);
    formData.append("party", form.party);
    formData.append("symbol", form.symbol);
    formData.append("manifesto", form.manifesto);

    if (form.photo) {
      formData.append("photo", form.photo);
    }

    onSubmit(formData);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Candidate Form</h2>

      <label>Election</label>

      <select
        name="election_id"
        value={form.election_id}
        onChange={handleChange}
        required
      >
        <option value="">Select Election</option>

        {elections.map((election) => (
          <option
            key={election.id}
            value={election.id}
          >
            {election.title}
          </option>
        ))}
      </select>

      <label>Name</label>

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <label>Party</label>

      <input
        type="text"
        name="party"
        value={form.party}
        onChange={handleChange}
        required
      />

      <label>Election Symbol</label>

      <input
        type="text"
        name="symbol"
        value={form.symbol}
        onChange={handleChange}
      />

      <label>Manifesto</label>

      <textarea
        name="manifesto"
        value={form.manifesto}
        onChange={handleChange}
      />

      <label>Candidate Photo</label>

      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleChange}
      />

      <button type="submit">
        Save Candidate
      </button>
    </form>
  );
}

export default CandidateForm;