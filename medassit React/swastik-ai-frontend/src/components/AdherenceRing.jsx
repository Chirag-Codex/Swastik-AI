import React from 'react';

/**
 * Adherence summary, styled as a printed label ("stat tape") rather than
 * a chart — keeps numbers in mono type, consistent with every other
 * dose/time value in the app.
 */
function AdherenceRing({ percentage = 0, trendLabel, size }) {
  const rounded = Math.round(percentage);

  return (
    <div className="label-card">
      <div className="label-card__perf" />
      <div className="stat-tape">
        <div className="stat-tape__num" style={size ? { fontSize: size * 0.22 } : undefined}>
          {rounded}
          <span style={{ fontSize: '0.5em' }}>%</span>
        </div>
        <div className="stat-tape__divider">
          <p className="eyebrow" style={{ margin: 0 }}>Adherence · 30 days</p>
          {trendLabel && (
            <p className="text-accent" style={{ fontSize: 12, margin: '2px 0 0' }}>
              {trendLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdherenceRing;
