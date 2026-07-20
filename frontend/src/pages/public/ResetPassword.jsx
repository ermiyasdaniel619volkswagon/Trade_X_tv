import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api.js';
import { useTheme } from '../../context/ThemeContext.jsx';

const ResetPassword = () => {
  const { isDark } = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');

    setError('');
    setIsSubmitting(true);
    try {
      await api.post(`/auth/reset-password/${encodeURIComponent(token)}`, form);
      toast.success('Password reset successfully. Please sign in.');
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to reset the password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <main className={`min-h-screen grid place-items-center px-4 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <section className={`w-full max-w-md rounded-2xl border p-7 shadow-xl ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A3258] text-white"><FiLock size={22} /></div>
        <h1 className="text-2xl font-bold">Create a new password</h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Use at least 8 characters. The reset link works only once.</p>
        {error && <div role="alert" className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-500">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div><label htmlFor="new-password" className="mb-1.5 block text-sm font-medium">New password</label><input id="new-password" name="password" type="password" value={form.password} onChange={updateField} required minLength={8} autoComplete="new-password" className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#B69F60]/50 ${isDark ? 'bg-[#2a2a2a] border-gray-700' : 'bg-gray-50 border-gray-200'}`} /></div>
          <div><label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium">Confirm new password</label><input id="confirm-password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField} required minLength={8} autoComplete="new-password" className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#B69F60]/50 ${isDark ? 'bg-[#2a2a2a] border-gray-700' : 'bg-gray-50 border-gray-200'}`} /></div>
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#A53D32] px-4 py-3 font-semibold text-white disabled:opacity-50">{isSubmitting ? 'Updating...' : 'Reset password'}</button>
        </form>
        <Link to="/forgot-password" className={`mt-6 block text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Request a new reset link</Link>
      </section>
    </main>
  );
};

export default ResetPassword;
