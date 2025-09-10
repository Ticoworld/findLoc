import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

const AuthGate = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Auto-open on mount
    setOpen(true);
  }, []);

  const handleSuccess = () => {
    // On login success, go to main app
    setOpen(false);
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="bg-white/10 border border-white/20 rounded-2xl p-6 max-w-md w-full text-center text-white">
        <h1 className="text-2xl font-bold mb-2">AE-FUNAI Navigator</h1>
        <p className="text-white/80 mb-4">Please sign in to access the campus map and routing features.</p>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-500/90 hover:bg-blue-600/90 transition text-white"
        >
          Sign In / Register
        </button>
      </div>

      <AuthModal isOpen={open} onClose={() => setOpen(false)} onSuccess={handleSuccess} />
    </div>
  );
};

export default AuthGate;
