import React from 'react';

const DAY_LABELS = ['SU', 'M', 'TU', 'W', 'TH', 'F', 'SA'];

/**
 * The signature "pill organizer" week strip.
 * scheduleByDay: array of 7 entries, e.g. [{ total: 2, taken: 2 }, ...]
 * matching Sunday..Saturday, aligned to DAY_LABELS.
 */
function WeekTray({ scheduleByDay = [] }) {
  const today = new Date().getDay(); // 0 = Sunday

  return (
    <div className="week-tray" role="img" aria-label="This week's dose schedule by day">
      {DAY_LABELS.map((label, i) => {
        const day = scheduleByDay[i] || { total: 0, taken: 0 };
        const isToday = i === today;
        const dots = Array.from({ length: Math.max(day.total, isToday ? 1 : 0) });

        return (
          <div key={label} className={`day-cell ${isToday ? 'day-cell--active' : ''}`}>
            <p className="day-cell__label">{label}</p>
            <div className="day-cell__dots">
              {dots.length === 0 ? (
                <span className="dot" style={{ borderColor: 'transparent' }} />
              ) : (
                dots.map((_, dotIndex) => (
                  <span
                    key={dotIndex}
                    className={`dot ${dotIndex < day.taken ? 'dot--filled' : ''}`}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WeekTray;
