import React from 'react';

/**
 * icon: a react-icons component (e.g. TbBellOff), passed directly, not a string.
 * tint: 'accent' | 'info' | 'violet' | 'success' | 'danger' — controls the badge color.
 */
function EmptyState({ icon: Icon, tint = 'accent', title, description }) {
  const tintClass = `icon-chip--${tint}`;

  return (
    <div className="text-center" style={{ padding: '48px 0' }}>
      <div
        className={`empty-badge ${tintClass}`}
        style={{ width: 64, height: 64, borderRadius: 16, border: 'none' }}
      >
        {Icon && <Icon size={28} />}
      </div>
      <h3 className="heading" style={{ fontSize: 17, marginBottom: 8 }}>{title}</h3>
      {description && (
        <p className="text-secondary" style={{ fontSize: 15, maxWidth: 320, margin: '0 auto' }}>
          {description}
        </p>
      )}
    </div>
  );
}

export default EmptyState;
