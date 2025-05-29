import React from 'react';
import { format, subDays } from 'date-fns';

export default function GardenView({ habits }) {
  const classes = ['🌱', '🌿', '🌳', '🌸'];
  const emptyPot = '🪴';
  const today = new Date();

  return (
    <div>
      <h2>Garden View</h2>
      {habits.map((h, i) => {
        let count = 0;
        for (let d = 0; d < 7; d++) {
          const key = format(subDays(today, d), 'yyyy-MM-dd');
          if (h.history?.[key]) count++;
          else break;
        }
        const plantEmoji =
          count === 0
            ? emptyPot
            : classes[Math.min(count - 1, classes.length - 1)];
        return (
          <div key={i} style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '2rem', color: h.color }}>{plantEmoji}</span>{' '}
            <span style={{ fontWeight: 'bold', color: h.color }}>{h.name}</span> (Streak: {count})
          </div>
        );
      })}
    </div>
  );
}
