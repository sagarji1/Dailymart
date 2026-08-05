// src/pages/LoginPage.jsx
import React, { useState } from 'react';// Adjust the path as necessary

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Replace this with API call or logic
    console.log('Logging in with', { email, password });
    alert("Logged in (simulated)!");
  };

  return (
    <div>
      <div className="flex justify-center items-center h-[80vh] bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Customer Login</h2>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
