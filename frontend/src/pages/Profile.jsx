import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { getProfile, updateProfile, changePassword } from "../services/authService";
import { getVoteHistory } from "../services/voteService";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import "../styles/profile.css";

function Profile() {
    const { login, user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const [profileForm, setProfileForm] = useState({ full_name: "", phone: "" });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [profileRes, historyRes] = await Promise.all([getProfile(), getVoteHistory()]);
            setProfile(profileRes.data);
            setProfileForm({ full_name: profileRes.data.full_name, phone: profileRes.data.phone || "" });
            setHistory(historyRes.data || []);
        } catch (err) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const res = await updateProfile(profileForm);
            setProfile(res.data);
            const token = localStorage.getItem("token");
            login(res.data, token); // refresh cached user (e.g. navbar name)
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSavingPassword(true);
        try {
            await changePassword(passwordForm);
            toast.success("Password changed successfully");
            setPasswordForm({ currentPassword: "", newPassword: "" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setSavingPassword(false);
        }
    };

    if (loading) return <Loader label="Loading profile..." />;

    return (
        <div className="container profile-page">
            <div className="page-header">
                <h1>My Profile</h1>
            </div>

            <div className="profile-grid">
                <form className="form-container" onSubmit={handleProfileSubmit}>
                    <h2>Account Details</h2>

                    <label>Full Name</label>
                    <input
                        type="text"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                        required
                    />

                    <label>Email</label>
                    <input type="email" value={profile?.email || ""} disabled />

                    <label>Phone</label>
                    <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />

                    <label>Role</label>
                    <input type="text" value={profile?.role || ""} disabled />

                    <button type="submit" disabled={savingProfile}>
                        {savingProfile ? "Saving..." : "Save Changes"}
                    </button>
                </form>

                <form className="form-container" onSubmit={handlePasswordSubmit}>
                    <h2>Change Password</h2>

                    <label>Current Password</label>
                    <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                    />

                    <label>New Password</label>
                    <input
                        type="password"
                        minLength={6}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                    />

                    <button type="submit" disabled={savingPassword}>
                        {savingPassword ? "Updating..." : "Change Password"}
                    </button>
                </form>
            </div>

            <section className="vote-history-section">
                <h2>My Voting History</h2>
                {history.length === 0 ? (
                    <EmptyState title="No votes cast yet" message="Your voting history will appear here." />
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Election</th>
                                    <th>Candidate Voted For</th>
                                    <th>Party</th>
                                    <th>Voted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((h) => (
                                    <tr key={h.id}>
                                        <td>{h.election_title}</td>
                                        <td>{h.candidate_name}</td>
                                        <td>{h.party_name}</td>
                                        <td>{new Date(h.voted_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Profile;
