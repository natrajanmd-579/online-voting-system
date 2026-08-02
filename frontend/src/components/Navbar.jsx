import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/elections", label: "Elections" },
    { to: "/candidates", label: "Candidates" },
    { to: "/vote", label: "Vote" },
    { to: "/results", label: "Results" },
    { to: "/profile", label: "Profile" },
];

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard">🗳️ Online Voting System</Link>
            </div>

            <button
                className="navbar-toggle"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
            >
                ☰
            </button>

            <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
                {links
                    .filter((l) => {
                        const adminOnlyLink = l.to === "/elections" || l.to === "/candidates";
                        return !adminOnlyLink || user?.role === "admin";
                    })
                    .map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) => (isActive ? "active" : "")}
                            onClick={() => setMenuOpen(false)}
                        >
                            {l.label}
                        </NavLink>
                    ))}
            </nav>

            <div className="navbar-user">
                {user && <span className="navbar-username">{user.full_name}</span>}
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Navbar;
