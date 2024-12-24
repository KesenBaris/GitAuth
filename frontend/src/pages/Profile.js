import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [emailSent, setEmailSent] = useState(false); // E-posta gönderim durumu

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute(
      'data-theme',
      currentTheme === 'dark' ? 'light' : 'dark'
    );
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/user', { withCredentials: true })
      .then((response) => {
        console.log('User Data:', response.data);
        setUser(response.data);

        // Eğer e-posta gönderildiyse durumu kontrol et
        if (response.data.email) {
          setEmailSent(true); // E-posta gönderimi başarılıysa bunu set et
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <h1 className="text-white text-4xl font-extrabold animate-pulse">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <button
        onClick={toggleTheme}
        className="btn btn-secondary absolute top-4 right-4"
      >
        Toggle Theme
      </button>
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="flex flex-col items-center p-6 space-y-4">
            <img
              src={user.avatar}
              alt="GitHub Avatar"
              className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-md transform transition-transform hover:scale-110 hover:rotate-6"
            />
            <h1 className="text-3xl font-bold text-purple-400">
              Welcome, {user.username || 'User'}
            </h1>
            <p className="text-gray-400 italic">
              {user.email || 'No email available'}
            </p>
            {emailSent && (
              <p className="text-green-400 font-bold">
                🎉 A 50% discount code has been sent to your email!
              </p>
            )}
            <div className="flex space-x-4 mt-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-purple-400">
                  Followers
                </h3>
                <p className="text-gray-300">{user.followers}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-purple-400">
                  Following
                </h3>
                <p className="text-gray-300">{user.following}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-b-lg max-h-96 overflow-y-scroll">
            <h2 className="text-xl font-semibold text-purple-400 mb-4">
              Repositories:
            </h2>
            {user.repos.length > 0 ? (
              <ul className="space-y-4">
                {user.repos.map((repo, index) => (
                  <li
                    key={index}
                    className="bg-gray-800 p-4 rounded-md shadow-md hover:bg-purple-500 transition duration-300"
                  >
                    <a
                      href={`https://github.com/${user.username}/${repo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-semibold text-purple-400 hover:underline"
                    >
                      {repo.name}
                    </a>
                    <p className="text-gray-400 mt-2">
                      {repo.description || 'No description available'}
                    </p>
                    <div className="flex space-x-4 mt-2">
                      <span className="text-gray-300">⭐ {repo.stars}</span>
                      <span className="text-gray-300">🍴 {repo.forks}</span>
                      <span className="text-gray-300 text-sm">
                        Last updated: {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">No repositories available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
