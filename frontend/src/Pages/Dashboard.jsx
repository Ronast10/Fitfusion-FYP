import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2      >
      <p>Welcome to FitFusion</p>

      <Link to="/">Logout</Link>
    </div>
  );
}

export default Dashboard;
