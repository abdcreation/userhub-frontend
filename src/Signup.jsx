import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
     
    const handleSubmit = async (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/register',{name,email,password})
        .then(res => {
            console.log(res)
            navigate('/')
        })
        .catch(err => console.log(err))
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.logo}>UserHub</h1>
                </div>
                
                <div style={styles.content}>
                    <h2 style={styles.welcomeTitle}>Create account</h2>
                    <p style={styles.subtitle}>Sign up to get started</p>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>NAME</label>
                            <input 
                                type="text" 
                                placeholder="Enter your name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)} 
                                style={styles.input}
                                required
                            />
                        </div>

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
                                placeholder="Create a password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                style={styles.input}
                                required
                            />
                        </div>

                        <button type="submit" style={styles.button}>
                            Sign up →
                        </button>
                    </form>
                    
                    <p style={styles.loginLink}>
                        Already have an account? <Link to="/" style={styles.link}>Login</Link>
                    </p>

                    <p style={styles.demoText}>
                        Join the community today
                    </p>
                </div>
            </div>
        </div>
    )
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
    loginLink: {
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

// Add hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    button:hover {
        background-color: #00cc6a !important;
        transform: translateY(-2px);
        box-shadow: 0 0 20px rgba(0,255,136,0.5) !important;
        cursor: pointer;
    }
    
    a:hover {
        color: #00cc6a !important;
        text-decoration: underline !important;
    }
    
    input:focus {
        border-bottom-color: #00ff88 !important;
    }
    
    input:hover {
        border-bottom-color: #555555 !important;
    }
`;
document.head.appendChild(styleSheet);

export default Signup;