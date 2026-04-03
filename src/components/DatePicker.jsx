import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import './DatePicker.css';

export default function DatePicker({ value, onChange, placeholder = 'Seleccionar fecha' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef(null);

  // Parse initial value or default to today
  useEffect(() => {
    if (value) {
      const parts = value.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (!isNaN(date.getTime())) {
          setCurrentMonth(date);
        }
      }
    }
  }, [value, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onChange(formatDate(selectedDate));
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    
    const days = [];
    // Empty slots before first day
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Day slots
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = formatDate(new Date(year, month, day));
      const isSelected = dateStr === value;
      const isToday = formatDate(new Date()) === dateStr;
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const handleQuickSelect = (type) => {
    const d = new Date();
    if (type === 'tomorrow') d.setDate(d.getDate() + 1);
    if (type === 'weekend') {
      const day = d.getDay();
      const diff = (day === 0 ? 0 : 7 - day) + 5; // Next Friday
      d.setDate(d.getDate() + (day <= 5 ? 5 - day : 12 - day));
    }
    onChange(formatDate(d));
    setIsOpen(false);
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="date-picker-container" ref={dropdownRef}>
      <div 
        className={`date-picker-header ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon size={16} className="calendar-icon" />
        <span className="selected-date-text">
          {value ? value.split('-').reverse().join('/') : placeholder}
        </span>
      </div>
      
      {isOpen && (
        <div className="date-picker-dropdown animate-fade-in-fast">
          <div className="quick-actions">
            <button type="button" onClick={() => handleQuickSelect('today')}>Hoy</button>
            <button type="button" onClick={() => handleQuickSelect('tomorrow')}>Mañana</button>
            <button type="button" onClick={() => handleQuickSelect('weekend')}>Fin de Sem.</button>
          </div>

          <div className="calendar-header">
            <button type="button" className="calendar-nav-btn" onClick={handlePrevMonth}>
              <ChevronLeft size={18} />
            </button>
            <div className="calendar-month-year">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button type="button" className="calendar-nav-btn" onClick={handleNextMonth}>
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="calendar-weekdays">
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
              <div key={d} className="weekday">{d}</div>
            ))}
          </div>
          
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
}
