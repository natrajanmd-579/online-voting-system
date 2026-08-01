import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const { logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/");

    };

    return (

        <div style={{padding:"40px"}}>

            <h1>

                Online Voting System

            </h1>

            <h2>

                Welcome

            </h2>

            <button onClick={handleLogout}>

                Logout

            </button>

        </div>

    );

}

export default Dashboard;