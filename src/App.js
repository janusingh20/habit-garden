import React, { useState, useEffect } from 'react';
import HabitSetup from './components/HabitSetup';
import DailyTracker from './components/DailyTracker';
import GardenView from './components/GardenView';
import { format } from 'date-fns';

export default function App() {
  const [habits, setHabits] = useState(() => {
    return JSON.parse(localStorage.getItem('habits') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const scheduleReminder = () => {
      const now = new Date();
      const reminder = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
      if (reminder <= now) reminder.setDate(reminder.getDate() + 1);
      const timeout = reminder - now;
      setTimeout(() => {
        new Notification('Habit Garden Reminder', {
          body: "Don't forget to check in your habits today!",
        });
        scheduleReminder();
      }, timeout);
    };
    scheduleReminder();
  }, []);

  const startVoiceCheck = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      let matched = false;
      habits.forEach((h, idx) => {
        if (transcript.includes(h.name.toLowerCase())) {
          const newHabits = [...habits];
          const hist = { ...(newHabits[idx].history || {}) };
          hist[todayKey] = !hist[todayKey];
          newHabits[idx] = { ...newHabits[idx], history: hist };
          setHabits(newHabits);
          alert(`${h.name} checked ${hist[todayKey] ? 'on' : 'off'} for today`);
          matched = true;
        }
      });
      if (!matched) {
        alert('No matching habit found in your command: ' + transcript);
      }
    };
    recognition.onerror = () => alert('Voice recognition error');
  };

  return (
    <div className="container">
      <h1>Habit Garden Voice</h1>
      <button onClick={startVoiceCheck}>🎤 Voice Check-In</button>
      <HabitSetup habits={habits} setHabits={setHabits} />
      <DailyTracker habits={habits} setHabits={setHabits} />
      <GardenView habits={habits} />
    </div>
  );
}
