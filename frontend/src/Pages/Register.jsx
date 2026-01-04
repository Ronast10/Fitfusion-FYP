import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Register Data:", { name, email, password });

    // simulate successful registration
    setSuccess(true);

    // optional: redirect to login after 2 seconds
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto" }}>
      <h2>Register</h2>

      {success && (
        <p style={{ color: "green" }}>
          Registered successfully! Redirecting to login...
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button style={{ marginTop: "15px" }} type="submit">
          Register
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;
