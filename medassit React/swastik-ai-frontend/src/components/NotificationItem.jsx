import React from 'react';
import { TbBell, TbClock, TbMessageChatbot, TbInfoCircle } from 'react-icons/tb';

const ICON_BY_CHANNEL = {
  reminder: { Icon: TbClock, tint: 'accent' },
  chat: { Icon: TbMessageChatbot, tint: 'violet' },
  system: { Icon: TbInfoCircle, tint: 'info' },
};

function NotificationItem({ notification }) {
  const { Icon, tint } = ICON_BY_CHANNEL[notification.channel] || { Icon: TbBell, tint: 'accent' };

  return (
    <div className={`label-card rise-in ${!notification.read ? 'label-card--due' : ''}`}>
      <div className="label-card__perf" />
      <div className="label-card__body">
        <div className={`icon-chip icon-chip--${tint}`}>
          <Icon size={17} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, margin: 0, color: 'var(--text-primary)' }}>{notification.message}</p>
          <p className="mono text-secondary" style={{ fontSize: 11, margin: '4px 0 0' }}>
            {notification.createdAt}
          </p>
        </div>
        {!notification.read && (
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
        )}
      </div>
    </div>
  );
}

export default NotificationItem;
