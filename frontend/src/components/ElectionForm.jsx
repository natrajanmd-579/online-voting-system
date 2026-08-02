import { useState, useEffect } from "react";

function ElectionForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "upcoming",
  });

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        start_date: (initialData.start_date || "").slice(0, 10),
        end_date: (initialData.end_date || "").slice(0, 10),
        status: initialData.status || "upcoming",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Election Form</h2>

      <label>Election Title</label>

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <label>Description</label>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        rows="5"
      />

      <label>Start Date</label>

      <input
        type="date"
        name="start_date"
        value={form.start_date}
        onChange={handleChange}
        required
      />

      <label>End Date</label>

      <input
        type="date"
        name="end_date"
        value={form.end_date}
        onChange={handleChange}
        required
      />

      <label>Status</label>

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
      >
        <option value="upcoming">Upcoming</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>

      <button type="submit">
        Save Election
      </button>
    </form>
  );
}

export default ElectionForm;