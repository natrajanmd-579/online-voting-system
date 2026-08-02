import Navbar from "./Navbar";

function Layout({ children }) {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="app-content">{children}</main>
        </div>
    );
}

export default Layout;
