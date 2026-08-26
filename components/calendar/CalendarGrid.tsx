"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export interface CalendarChip {
  id: string;
  label: string;
  date: string; // ISO date
  onClick?: () => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CalendarGrid({ chips, title }: { chips: CalendarChip[]; title?: string }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const todayISO = toISODate(new Date());

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const offset = (firstOfMonth.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: { date: Date; iso: string; other: boolean }[] = [];

    for (let i = 0; i < offset; i++) {
      const d = new Date(year, month, i - offset + 1);
      cells.push({ date: d, iso: toISODate(d), other: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      cells.push({ date, iso: toISODate(date), other: false });
    }
    while (cells.length % 7 !== 0 || cells.length < 35) {
      const last = cells[cells.length - 1].date;
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      cells.push({ date: next, iso: toISODate(next), other: true });
    }
    return cells;
  }, [cursor]);

  const chipsByDate = useMemo(() => {
    const map = new Map<string, CalendarChip[]>();
    for (const chip of chips) {
      const list = map.get(chip.date) ?? [];
      list.push(chip);
      map.set(chip.date, list);
    }
    return map;
  }, [chips]);

  return (
    <div className="card">
      <div className="panel-head">
        <div>
          <strong>
            {title ?? `${MONTH_NAMES[cursor.getMonth()]} ${cursor.getFullYear()}`}
          </strong>
          <div className="tiny muted" style={{ marginTop: 3 }}>
            Deadlines and scheduled work
          </div>
        </div>
        <div className="actions">
          <button
            type="button"
            className="btn"
            onClick={() => {
              const now = new Date();
              setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
            }}
          >
            Today
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Previous month"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Next month"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="calendar-wrap">
        <div className="calendar">
          {WEEKDAYS.map((w) => (
            <div key={w} className="cal-head">
              {w}
            </div>
          ))}
          {days.map((cell) => {
            const dayChips = chipsByDate.get(cell.iso) ?? [];
            const isToday = cell.iso === todayISO;
            return (
              <div key={cell.iso} className={`day ${cell.other ? "other" : ""} ${isToday ? "today" : ""}`}>
                <div className="day-num">{cell.date.getDate()}</div>
                {dayChips.map((chip) => (
                  <div key={chip.id} className="cal-task" onClick={chip.onClick} title={chip.label}>
                    {chip.label}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
