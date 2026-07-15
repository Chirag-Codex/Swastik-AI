import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { TbHome2, TbClipboardList, TbPill, TbSearch, TbUserCircle, TbLogout } from 'react-icons/tb';

const ITEMS = [
  { to: '/', label: 'Home', Icon: TbHome2, end: true },
  { to: '/reminders', label: 'Reminders', Icon: TbClipboardList },
  { to: '/chat', label: 'Swastik', Icon: TbPill, isFab: true },
  { to: '/medicine-lookup', label: 'Lookup', Icon: TbSearch },
  { to: '/profile', label: 'Profile', Icon: TbUserCircle },
  // 1. Added Logout action metadata here
  { action: 'logout', label: 'Logout', Icon: TbLogout }, 
];

function BottomNav() {
  const navigate = useNavigate();

  // 2. Extracted handler to clear tokens/session and redirect
  const handleLogout = () => {
    // Optional: Add your auth clearing logic here (e.g., localStorage.removeItem('token'))
    localStorage.clear(); 
    navigate('/login');
  };

  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ to, label, Icon, end, isFab, action }) => {
        // 3. Handle the Logout button render & click behavior
        if (action === 'logout') {
          return (
            <button
              key="logout-btn"
              onClick={handleLogout}
              className="bottom-nav__item bottom-nav__item--logout"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Icon size={21} />
              <span>{label}</span>
            </button>
          );
        }

        // Handle FAB (Swastik) item
        if (isFab) {
          return (
            <NavLink key={to} to={to} className="bottom-nav__item bottom-nav__item--fab" title={label}>
              {({ isActive }) => (
                <div className="bottom-nav__fab-circle" style={{ opacity: isActive ? 1 : 0.9 }}>
                  <Icon size={24} />
                </div>
              )}
            </NavLink>
          );
        }

        // Handle standard items
        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
          >
            <Icon size={21} />
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default BottomNav;