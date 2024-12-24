import React from 'react';

const Home = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/github';
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <button className="btn btn-primary" onClick={handleLogin}>
        Login with GitHub
      </button>
    </div>
  );
};

export default Home;
