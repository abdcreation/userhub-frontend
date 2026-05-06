import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/', { email, password })
      .then(res => {
        console.log(res);
        if(res.status === 200){
          navigate("/dashboard");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Invalid Credentials ❌");
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.logo}>UserHub</h1>
        </div>
        
        <div style={styles.content}>
          <h2 style={styles.welcomeTitle}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>EMAIL</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>PASSWORD</label>
              <input 
                type="password" 
                placeholder="**********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.button}>
              Sign in →
            </button>
          </form>
          
          <p style={styles.registerLink}>
            Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
          </p>

          <p style={styles.demoText}>
            Demo: any email & password works
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    fontFamily: "system-ui, -apple-system, sans-serif"
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    width: "450px",
    maxWidth: "90%",
    overflow: "hidden",
    border: "1px solid #2a2a2a"
  },
  header: {
    backgroundColor: "#0f0f0f",
    padding: "24px 32px",
    borderBottom: "1px solid #2a2a2a"
  },
  logo: {
    fontSize: "24px",
    fontWeight: "600",
    margin: 0,
    color: "#00ff88",
    textShadow: "0 0 10px rgba(0,255,136,0.3)"
  },
  content: {
    padding: "40px 32px"
  },
  welcomeTitle: {
    fontSize: "28px",
    fontWeight: "600",
    margin: "0 0 8px 0",
    color: "#ffffff"
  },
  subtitle: {
    fontSize: "16px",
    color: "#888888",
    margin: "0 0 32px 0"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    color: "#888888",
    textTransform: "uppercase"
  },
  input: {
    width: "100%",
    padding: "12px 0",
    fontSize: "16px",
    border: "none",
    borderBottom: "2px solid #333333",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    backgroundColor: "transparent",
    color: "#ffffff"
  },
  button: {
    width: "100%",
    padding: "14px 24px",
    marginTop: "16px",
    backgroundColor: "#00ff88",
    color: "#000000",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 0 15px rgba(0,255,136,0.3)"
  },
  registerLink: {
    marginTop: "24px",
    fontSize: "14px",
    color: "#888888",
    textAlign: "center"
  },
  link: {
    color: "#00ff88",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.2s"
  },
  demoText: {
    marginTop: "32px",
    fontSize: "13px",
    color: "#555555",
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid #2a2a2a"
  }
};

// Add hover effect for button and link
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  button:hover {
    background-color: #00cc6a !important;
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(0,255,136,0.5) !important;
  }
  
  a:hover {
    color: #00cc6a !important;
    text-decoration: underline !important;
  }
  
  input:focus {
    border-bottom-color: #00ff88 !important;
  }
`;
document.head.appendChild(styleSheet);

export default Login;