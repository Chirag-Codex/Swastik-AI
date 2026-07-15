import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TbBell, TbBellOff, TbChecks } from 'react-icons/tb';
import { getNotifications, markAllRead } from '../redux/notification/Action';
import NotificationItem from '../components/NotificationItem';
import EmptyState from '../components/EmptyState';

function Notifications() {
  const dispatch = useDispatch();
  const { notifications, loading, unreadCount } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    await dispatch(markAllRead());
    dispatch(getNotifications());
  };

  return (
    <div className="container-custom pb-8">
      <div className="flex justify-between items-center py-4">
        <h2 className="heading flex items-center gap-2" style={{ fontSize: 20 }}>
          <TbBell size={20} style={{ color: 'var(--accent-dark)' }} />
          Notifications
          {unreadCount > 0 && (
            <span className="text-secondary" style={{ fontSize: 14, fontWeight: 400 }}>({unreadCount} unread)</span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button className="btn-secondary" style={{ minHeight: 36, padding: '6px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }} onClick={handleMarkAllRead}>
            <TbChecks size={14} />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-secondary text-center" style={{ padding: '32px 0' }}>Loading notifications…</p>
      ) : notifications.length === 0 ? (
        <EmptyState icon={TbBellOff} tint="accent" title="No notifications" description="You're all caught up." />
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
