import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TbBell } from 'react-icons/tb';
import { getUnreadCount } from '../redux/notification/Action';

/**
 * Drop-in bell button for any page header — dispatches its own unread
 * count fetch on mount, so it works consistently wherever it's placed.
 */
function NotificationBell() {
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(getUnreadCount());
  }, [dispatch]);

  return (
    <Link
      to="/notifications"
      className="icon-chip icon-chip--accent"
      style={{ position: 'relative', textDecoration: 'none', flexShrink: 0 }}
      title="Notifications"
    >
      <TbBell size={18} />
      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, borderRadius: '50%',
            background: 'var(--danger)', color: '#FFFFFF', fontSize: 10, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
          }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}

export default NotificationBell;
