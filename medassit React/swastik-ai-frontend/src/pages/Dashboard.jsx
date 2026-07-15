import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { TbCalendar, TbCircleCheck } from 'react-icons/tb';
import { getAdherence } from '../redux/dashboard/Action';
import { getReminders } from '../redux/reminder/Action';
import AdherenceRing from '../components/AdherenceRing';
import ReminderCard from '../components/ReminderCard';
import WeekTray from '../components/WeekTray';
import EmptyState from '../components/EmptyState';
import NotificationBell from '../components/NotificationBell';

function buildWeekSchedule(reminders) {
  const activeCount = reminders.filter((r) => r.active).length;
  const takenToday = reminders.filter((r) => r.active && r.takenToday).length;
  const today = new Date().getDay();

  return Array.from({ length: 7 }, (_, i) => ({
    total: activeCount,
    taken: i === today ? takenToday : 0,
  }));
}

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { adherence } = useSelector((state) => state.dashboard);
  const { reminders, loading: remindersLoading } = useSelector((state) => state.reminder);
  const [todayReminders, setTodayReminders] = useState([]);

  useEffect(() => {
    dispatch(getAdherence(30));
    dispatch(getReminders());
  }, [dispatch]);

  useEffect(() => {
    setTodayReminders(reminders.filter((r) => r.active).slice(0, 5));
  }, [reminders]);

  const overallAdherence = (adherence?.overallAdherenceRate || 0) * 100;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const trend = adherence?.trendDelta
    ? `${adherence.trendDelta > 0 ? '\u25B2' : '\u25BC'} ${Math.abs(Math.round(adherence.trendDelta * 100))}% vs last month`
    : null;

  return (
    <div className="container-custom pb-8">
      <div className="flex justify-between items-center py-4">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>{greeting}</p>
          <h2 className="heading" style={{ fontSize: 20, margin: '2px 0 0' }}>
            {user?.fullName || 'there'}
          </h2>
        </div>
        <NotificationBell />
      </div>

      <p className="eyebrow" style={{ marginBottom: 8 }}>This week</p>
      <WeekTray scheduleByDay={buildWeekSchedule(reminders)} />

      <div className="mb-6">
        <AdherenceRing percentage={overallAdherence} trendLabel={trend} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="heading flex items-center gap-2" style={{ fontSize: 15 }}>
            <TbCalendar size={17} style={{ color: 'var(--accent-dark)' }} />
            Today's reminders
          </h3>
          <Link to="/reminders" style={{ fontSize: 13, color: 'var(--accent-dark)', fontWeight: 600, textDecoration: 'none' }}>
            See all
          </Link>
        </div>

        {remindersLoading ? (
          <p className="text-secondary text-center" style={{ padding: '32px 0' }}>Loading reminders…</p>
        ) : todayReminders.length === 0 ? (
          <EmptyState
            icon={TbCircleCheck}
            tint="success"
            title="All caught up"
            description="No pending reminders for today."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {todayReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onUpdate={() => dispatch(getReminders())}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
