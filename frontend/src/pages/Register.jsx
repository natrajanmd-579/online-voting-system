import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { toast } from "react-toastify";
import "../styles/auth.css";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        full_name: "",
        email: "",
        phone: "",
        password: ""

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSubmitting(true);

        try {

            const response = await registerUser(form);

            toast.success(response.message || "Registration successful");

            navigate("/");

        }

        catch (err) {

            toast.error(
                err.response?.data?.message || "Registration Failed"
            );

        } finally {
            setSubmitting(false);
        }

    };

    return (

        <div className="auth-container">

            <div className="auth-card">

                <h2>Online Voting System</h2>

                <h3>Register</h3>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        minLength={6}
                        required
                    />

                    <button type="submit" disabled={submitting}>

                        {submitting ? "Registering..." : "Register"}

                    </button>

                </form>

                <p>

                    Already have an account?

                    <Link to="/">

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;