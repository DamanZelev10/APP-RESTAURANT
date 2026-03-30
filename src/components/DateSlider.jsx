import React, { useMemo, useEffect, useRef } from 'react';
import './DateSlider.css';

export default function DateSlider({ selectedDate, onChange, lang = 'es' }) {
  const scrollRef = useRef(null);

  const dates = useMemo(() => {
    const list = [];
    const today = new Date();
    // Use local date to avoid timezone issues when showing current day
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      list.push(d);
    }
    return list;
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Ensure selected date is visible on mount
  useEffect(() => {
    if (scrollRef.current) {
      const selectedCard = scrollRef.current.querySelector('.date-card.selected');
      if (selectedCard) {
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, []);

  return (
    <div className="date-slider-wrapper">
      <div className="date-slider-scroll" ref={scrollRef}>
        {dates.map((date) => {
          const dateStr = formatDate(date);
          const isSelected = dateStr === selectedDate;
          
          // Format parts
          const dayName = date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { weekday: 'short' }).replace('.', '');
          const dayNum = date.getDate();
          const monthName = date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'short' }).replace('.', '');

          return (
            <div
              key={dateStr}
              className={`date-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onChange(dateStr)}
            >
              <span className="day-name">{dayName}</span>
              <div className="day-num-box">
                <span className="day-num">{dayNum}</span>
                <span className="month-name">{monthName}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
