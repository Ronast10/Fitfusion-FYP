// components/AdminNavbar.jsx
export default function AdminNavbar({ adminName }) {
  return (
    <nav className="admin-nav">
      <div className="logo">FitFusion ADMIN</div>
      <ul className="admin-links">
        <li>Dashboard</li>
        <li>Manage Users</li>
        <li className="active">Trainer Inquiries</li>
      </ul>
      <div className="admin-profile">
        <span>Logged in as: <strong>{adminName}</strong></span>
      </div>
    </nav>
  );
}