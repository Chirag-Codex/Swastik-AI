import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TbBell, TbPlayerPlay, TbPlayerPause, TbTrash, TbClipboardList, TbListDetails, TbCircleCheck } from 'react-icons/tb';
import { getReminders, toggleReminder, deleteReminder } from '../redux/reminder/Action';
import ReminderCard from '../components/ReminderCard';
import WeekTray from '../components/WeekTray';
import EmptyState from '../components/EmptyState';
import NotificationBell from '../components/NotificationBell';

const TABS = [
  { id: 'all', label: 'All', Icon: TbListDetails },
  { id: 'active', label: 'Active', Icon: TbPlayerPlay },
  { id: 'completed', label: 'Completed', Icon: TbCircleCheck },
];

function buildWeekSchedule(reminders) {
  const activeCount = reminders.filter((r) => r.active).length;
  const takenToday = reminders.filter((r) => r.active && r.takenToday).length;
  const today = new Date().getDay();
  return Array.from({ length: 7 }, (_, i) => ({
    total: activeCount,
    taken: i === today ? takenToday : 0,
  }));
}

function Reminders() {
  const dispatch = useDispatch();
  const { reminders, loading } = useSelector((state) => state.reminder);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(getReminders());
  }, [dispatch]);

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'active') return r.active;
    if (filter === 'completed') return !r.active;
    return true;
  });

  const handleToggle = async (id, active) => {
    await dispatch(toggleReminder(id, !active));
    dispatch(getReminders());
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this reminder?')) {
      await dispatch(deleteReminder(id));
      dispatch(getReminders());
    }
  };

  return (
    <div className="container-custom pb-8">
      <div className="flex justify-between items-center py-4">
        <h2 className="heading flex items-center gap-2" style={{ fontSize: 20 }}>
          <TbBell size={20} style={{ color: 'var(--accent-dark)' }} />
          All reminders
        </h2>
        <NotificationBell />
      </div>

      <p className="eyebrow" style={{ marginBottom: 8 }}>This week</p>
      <WeekTray scheduleByDay={buildWeekSchedule(reminders)} />

      <div className="flex gap-2 mb-4">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={filter === id ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, minHeight: 40, fontSize: 13, padding: '8px 10px' }}
            onClick={() => setFilter(id)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-secondary text-center" style={{ padding: '32px 0' }}>Loading reminders…</p>
      ) : filteredReminders.length === 0 ? (
        <EmptyState
          icon={TbClipboardList}
          tint="accent"
          title="No reminders found"
          description={filter === 'all' ? 'Create a reminder through the AI chat.' : `No ${filter} reminders.`}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredReminders.map((reminder) => (
            <div key={reminder.id}>
              <ReminderCard
                reminder={reminder}
                onUpdate={() => dispatch(getReminders())}
              />
              <div className="flex gap-4 mt-2 justify-end">
                <button className="btn-ghost-danger" onClick={() => handleToggle(reminder.id, reminder.active)} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                  {reminder.active ? <TbPlayerPause size={14} /> : <TbPlayerPlay size={14} />}
                  {reminder.active ? 'Pause' : 'Activate'}
                </button>
                <button className="btn-ghost-danger" onClick={() => handleDelete(reminder.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--danger)' }}>
                  <TbTrash size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reminders;
