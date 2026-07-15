import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TbCheck, TbClock } from 'react-icons/tb';
import { confirmDoseTaken } from '../redux/doseLog/Action';

function ReminderCard({ reminder, onUpdate }) {
  const dispatch = useDispatch();
  const [marking, setMarking] = useState(false);

  const taken = !!reminder.takenToday;
  const isDueNext = !taken && reminder.active;

  const handleMarkTaken = async () => {
    setMarking(true);
    try {
      await dispatch(confirmDoseTaken(reminder.id));
      onUpdate && onUpdate();
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className={`label-card rise-in ${isDueNext ? 'label-card--due' : ''}`}>
      <div className="label-card__perf" />
      <div className="label-card__body">
        <div
          className="mono"
          style={{ fontSize: 13, minWidth: 56, fontWeight: isDueNext ? 600 : 400, color: isDueNext ? 'var(--accent-dark)' : 'var(--text-secondary)' }}
        >
          {reminder.time}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, margin: 0, color: 'var(--text-primary)' }} className="truncate">
            {reminder.medicineName}
            {reminder.dosage ? <span className="text-secondary"> · {reminder.dosage}</span> : null}
          </p>
        </div>

        {taken ? (
          <div className="icon-chip icon-chip--success" style={{ width: 28, height: 28, borderRadius: 8 }} title="Taken">
            <TbCheck size={16} />
          </div>
        ) : isDueNext ? (
          <button
            className="btn-primary"
            style={{ minHeight: 36, padding: '8px 16px', fontSize: 13 }}
            onClick={handleMarkTaken}
            disabled={marking}
          >
            <TbCheck size={15} />
            {marking ? '…' : 'Mark taken'}
          </button>
        ) : (
          <div className="icon-chip" style={{ width: 28, height: 28, borderRadius: 8 }}>
            <TbClock size={14} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ReminderCard;
