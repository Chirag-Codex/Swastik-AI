// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { TbUserCircle, TbMail, TbBellRinging, TbShieldCheck, TbLogout, TbChevronRight, TbId } from 'react-icons/tb';
// import { getUser, logout } from '../redux/auth/Action';
// import NotificationBell from '../components/NotificationBell';

// const MENU_ITEMS = [
//   { icon: TbBellRinging, tint: 'accent', label: 'Notification preferences' },
//   { icon: TbShieldCheck, tint: 'success', label: 'Privacy & data' },
//   { icon: TbId, tint: 'info', label: 'About Swastik AI' },
// ];

// function Profile() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!user) dispatch(getUser());
//   }, [dispatch, user]);

//   const handleLogout = () => {
//     if (window.confirm('Log out of Swastik AI?')) {
//       dispatch(logout());
//       navigate('/login');
//     }
//   };

//   return (
//     <div className="container-custom pb-8">
//       <div className="flex justify-between items-center py-4">
//         <h2 className="heading" style={{ fontSize: 20 }}>Profile</h2>
//         <NotificationBell />
//       </div>

//       <div className="label-card mb-6">
//         <div className="label-card__perf" />
//         <div className="flex items-center gap-4" style={{ padding: 20 }}>
//           <div className="icon-chip icon-chip--accent" style={{ width: 56, height: 56, borderRadius: 16 }}>
//             <TbUserCircle size={30} />
//           </div>
//           <div style={{ minWidth: 0 }}>
//             <p className="heading truncate" style={{ fontSize: 17, margin: 0 }}>
//               {user?.fullName || 'Your account'}
//             </p>
//             <p className="text-secondary flex items-center gap-1 truncate" style={{ fontSize: 13, margin: '4px 0 0' }}>
//               <TbMail size={14} />
//               {user?.email || '—'}
//             </p>
//           </div>
//         </div>
//       </div>

//       <p className="eyebrow" style={{ marginBottom: 8 }}>Settings</p>
//       <div className="flex flex-col gap-3 mb-6">
//         {MENU_ITEMS.map(({ icon: Icon, tint, label }) => (
//           <button
//             key={label}
//             className="label-card flex items-center gap-3"
//             style={{ padding: '14px 16px', width: '100%', textAlign: 'left', cursor: 'pointer', background: 'var(--bg-card)', font: 'inherit' }}
//           >
//             <div className={`icon-chip icon-chip--${tint}`}>
//               <Icon size={17} />
//             </div>
//             <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{label}</span>
//             <TbChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
//           </button>
//         ))}
//       </div>

//       <button
//         className="btn-secondary flex items-center justify-center gap-2"
//         style={{ width: '100%', color: 'var(--danger)', borderColor: 'var(--danger-soft)' }}
//         onClick={handleLogout}
//       >
//         <TbLogout size={16} />
//         Log out
//       </button>
//     </div>
//   );
// }

// export default Profile;
