import { Navigate } from "react-router-dom";
import Layout from "./Layout";

function ProtectedRoute({ children, adminOnly = false }) {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/" replace />;

    if (adminOnly) {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;
    }

    return <Layout>{children}</Layout>;
}

export default ProtectedRoute;
