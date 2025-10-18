// This file is now interactive, so we must add "use client"
"use client";

// Added 'useState' for form logic
import { useState } from 'react';
import Image from "next/image";
import Card from "../components/Card";

export default function Home() {
  // --- State for the login form ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Form submission handler ---
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setLoading(true);
    setError('');

    // This is where you would send the data to your backend API
    console.log("Login attempt:", { email, password });

    // --- Example: Simulating a login check ---
    // In a real app, you would 'await fetch(...)' here
    setTimeout(() => {
      if (password !== 'password123') {
        setError('Invalid email or password.');
      } else {
        setError('');
        console.log('Login Successful!');
        // Redirect or save token here
      }
      setLoading(false);
    }, 1000); // Simulate a 1-second network delay
  };

  return (
    <div id="header">
        <div className="contain">
            {/* Header */}
            <nav className="sono-regular">
                
                {/* Logo (Unchanged from your original) */}
                <Image src="/texasA&MLogo.png"
                        width={200}            
                        height={200}           
                        alt="Texas A&M Logo"
                />
                
                {/* Navigation (Unchanged from your original) */}
                <ul id="sidemenu" className = "sono-regular">
                    <li><a href="#header"></a></li>
                    <li><a href="/home">Home</a></li>
                </ul>
            </nav>
            
            {/* --- Login Form Structure Added Below --- */}
            {/* I added id="login" so your nav link works */}
            <div id="login" className="login-form-wrapper">
              <h1 className="sono-regular">Login to Your Account</h1>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Shows an error message if one exists */}
                {error && <p className="error-message">{error}</p>}

                <button type="submit" disabled={loading} className="sono-regular">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
            {/* --- End of Login Form --- */}
        </div>
    </div>
  );
}