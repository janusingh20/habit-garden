import React from 'react';
import { format } from 'date-fns';

export default function DailyTracker({ habits, setHabits }) {
  const todayKey = format(new Date(), 'yyyy-MM-dd');

  const toggleDone = idx => {
    const newHabits = [...habits];
    const hist = { ...(newHabits[idx].history || {}) };
    hist[todayKey] = !hist[todayKey];
    newHabits[idx] = { ...newHabits[idx], history: hist };
    setHabits(newHabits);
  };

  return (
    <div>
      <h2>Today's Check-In</h2>
      {habits.map((h, i) => (
        <div key={i}>
          <label style={{ color: h.color }}>
            <input type="checkbox" checked={!!h.history?.[todayKey]} onChange={() => toggleDone(i)} />
            {h.name} ({h.category})
          </label>
        </div>
      ))}
    </div>
  );
}
