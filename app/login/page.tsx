// This file is interactive, so we must add "use client"
"use client";

// Added 'useState' for form logic
import React, { useState, type FormEvent } from 'react';
import NavBar from '../components/NavBar';
import Image from "next/image";
import Link from 'next/link';


// 1. Import the router to handle redirects
import { useRouter } from 'next/navigation';

export default function Home() {
  // 2. Initialize the router
  const router = useRouter();

  // State for the login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for error messages
  const [error, setError] = useState('');
  // State for loading
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Stop the page from reloading
    setLoading(true);
    setError('');

    // 3. Check the email and password
    if (email === 'user@gmail.com' && password === '1234') {
      // --- SUCCESS ---
      console.log('Login Successful!');
      
      // 4. Redirect to the homepage
      router.push('/home'); // This sends the user to your main page

    } else {
      // --- FAILURE ---
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div id="header">
        <NavBar inLoginPage={true} />

        <div className="contain">
            
            {/* --- Login Form --- */}
            <div id="login" className="login-form-wrapper">
              <h1 className="sono-regular">Login to Your Account</h1>
              
              <form onSubmit={handleSubmit}>
                
                {/* Shows an error message if one exists */}
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
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
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="sono-regular">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
            
        </div>
    </div>
  );
}