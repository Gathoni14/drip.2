import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await loginUser(email, password);

    if (!res.success) return setMsg(res.message);

    localStorage.setItem("token", res.token);
    navigate("/dashboard");
  };

  return (
    <div className="form-container">
      <h2>Drip Irrigation Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        <p>{msg}</p>
      </form>

      <p>
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
