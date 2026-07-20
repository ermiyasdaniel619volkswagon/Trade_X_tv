import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api.js';
import { useTheme } from '../../context/ThemeContext.jsx';

const ForgotPassword = () => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      toast.success('Check your email for the reset link.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to send the reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`min-h-screen grid place-items-center px-4 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <section className={`w-full max-w-md rounded-2xl border p-7 shadow-xl ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A3258] text-white"><FiMail size={22} /></div>
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Enter the email used for your customer account. We will send you a link that expires in 15 minutes.</p>

        {message ? (
          <div role="status" className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-600">{message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium">Email address</label>
              <input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="you@example.com" className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#B69F60]/50 ${isDark ? 'bg-[#2a2a2a] border-gray-700' : 'bg-gray-50 border-gray-200'}`} />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#A53D32] px-4 py-3 font-semibold text-white disabled:opacity-50">{isSubmitting ? 'Sending...' : 'Send reset link'}</button>
          </form>
        )}

        <Link to="/" className={`mt-6 flex items-center justify-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><FiArrowLeft /> Back to sign in</Link>
      </section>
    </main>
  );
};

export default ForgotPassword;
