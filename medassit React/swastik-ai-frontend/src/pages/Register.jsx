import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TbPill, TbMail, TbLock, TbLockCheck, TbUser, TbArrowRight } from 'react-icons/tb';
import { register } from '../redux/auth/Action';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await dispatch(register(registerData));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] label-card">
        <div className="label-card__perf" />
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <div
              className="icon-chip icon-chip--accent mx-auto mb-4"
              style={{ width: 52, height: 52, borderRadius: 14 }}
            >
              <TbPill size={26} />
            </div>
            <h1 className="heading" style={{ fontSize: 26 }}>
              Swastik <span style={{ color: 'var(--accent-dark)' }}>AI</span>
            </h1>
            <p className="text-secondary mt-2" style={{ fontSize: 15 }}>Create your account</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <div
                className="text-center"
                style={{ padding: 12, borderRadius: 10, background: 'var(--danger-soft)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: 14 }}
              >
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-secondary" style={{ fontSize: 13, fontWeight: 500 }} htmlFor="fullName">Full name</label>
              <div style={{ position: 'relative' }}>
                <TbUser size={18} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="input-field"
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-secondary" style={{ fontSize: 13, fontWeight: 500 }} htmlFor="email">Email</label>
              <div style={{ position: 'relative' }}>
                <TbMail size={18} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--text-secondary)' }} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  className="input-field"
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-secondary" style={{ fontSize: 13, fontWeight: 500 }} htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <TbLock size={18} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--text-secondary)' }} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  autoComplete="new-password"
                  minLength="6"
                  className="input-field"
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-secondary" style={{ fontSize: 13, fontWeight: 500 }} htmlFor="confirmPassword">Confirm password</label>
              <div style={{ position: 'relative' }}>
                <TbLockCheck size={18} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--text-secondary)' }} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                  minLength="6"
                  className="input-field"
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary mt-2" disabled={loading}>
              {loading ? 'Creating account…' : (
                <>
                  Sign up
                  <TbArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-center text-secondary mt-2" style={{ fontSize: 14 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--accent-dark)', fontWeight: 600 }}>Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
