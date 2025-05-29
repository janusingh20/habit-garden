import React, { useState } from 'react';

const preset = [
  { name: 'Health', color: '#4CAF50' },
  { name: 'Work',  color: '#2196F3' },
  { name: 'Learn', color: '#FF9800' },
];

export default function HabitSetup({ habits, setHabits }) {
  const [name, setName] = useState('');
  const [cat, setCat] = useState(preset[0].name);

  const addHabit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const { color } = preset.find(p => p.name === cat);
    setHabits([...habits, { name: trimmed, category: cat, color, history: {} }]);
    setName('');
  };

  return (
    <div>
      <h2>Setup Habits</h2>
      <input type="text" placeholder="New habit" value={name} onChange={e => setName(e.target.value)} />
      <select value={cat} onChange={e => setCat(e.target.value)}>
        {preset.map(p => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>
      <button onClick={addHabit}>Add</button>
    </div>
  );
}
