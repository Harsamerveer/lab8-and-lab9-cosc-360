import React, { useState } from 'react';

const Auth = () => {
  console.log("Auth component rendered!"); // Check if the component even loads

  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    console.log(`--- Attempting ${isLogin ? 'Login' : 'Sign Up'} ---`);
    console.log("Email:", email);

    if (!isLogin && password !== confirmPassword) {
      console.log("Validation Failed: Passwords do not match.");
      setMessage('Error: Passwords do not match!'); 
      return;
    }

    const url = isLogin ? 'http://localhost:5001/api/auth/login' : 'http://localhost:5001/api/auth/signup';
    console.log("Target URL:", url);
    
    try {
      let response;
      if (isLogin) {
        console.log("Sending Login payload...");
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
      } else {
        console.log("Preparing FormData for Sign Up with image...");
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        if (image) {
          console.log("Image attached:", image.name);
          formData.append('image', image);
        }

        response = await fetch(url, {
          method: 'POST',
          body: formData
        });
      }

      const data = await response.json();
      console.log("Server Response:", response.status, data);

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error || 'An error occurred'); 
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setMessage('Server connection failed.');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        
        <input 
          type="email" 
          placeholder="Email" 
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
        
        {!isLogin && (
          <>
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            <input 
              type="file" 
              accept="image/png, image/jpeg" 
              onChange={(e) => setImage(e.target.files[0])} 
            />
          </>
        )}
        
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      
      {message && <p style={{ color: message.includes('Error') || message.includes('failed') ? 'red' : 'green' }}>{message}</p>}

      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
        Switch to {isLogin ? 'Sign Up' : 'Login'}
      </button>
    </div>
  );
};

export default Auth;