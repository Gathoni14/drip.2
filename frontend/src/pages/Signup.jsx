import { useState } from "react";
import { signupUser } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import { Link } from "react-router-dom";


export default function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

   const validatePassword = (password) => {
    return {
      length: password.length >=8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordRules = validatePassword(password);

  

  const handleSignup = async (e) => {
    e.preventDefault();

    try {

    const res = await signupUser(name, email, password);
    console.log("Signup response:", res); // log api response
    

    if (!res.success) {
      // show error message
  setMsg(res.message || "Signup failed");
  return;
    }
     // save token or just redirect
     localStorage.setItem("token", res.token);

     // go to dashboard
     navigate("/dashboard");

  } catch (err) {
    setMsg("An error occured. Please try again.")
    console.error(err);
  }
    
  };

  return (
    <div className="form-container">
      <h2>🌿 Create an Account</h2>

      <form onSubmit={handleSignup}>
        <div>
          <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        </div>

        <div>
          <label>Email:</label>
          <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          />
        </div>


        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
         </div>

         <div>
           <label>Confirm Password:</label>
          <input type="password" 
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
         </div>

          {/* Password requirements*/}
        <div className="password-rules" style={{ fontSize: '14px', marginBottom: '10px' }}>
          <p style={{ color: passwordRules.length ? 'green' : 'red' }}>* Minimum 8 characters</p>
          <p style={{ color: passwordRules.uppercase ? 'green' : 'red' }}>* At least one uppercase letter</p>
          <p style={{ color: passwordRules.lowercase ? 'green' : 'red' }}>* At least one lowercase letter</p>
          <p style={{ color: passwordRules.number ? 'green' : 'red' }}>* At least one number</p>
          <p style={{ color: passwordRules.specialChar ? 'green' : 'red' }}>* At least one special character</p>
        </div>


         <button type="submit">Sign Up</button> 

        <p>{msg}</p>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
