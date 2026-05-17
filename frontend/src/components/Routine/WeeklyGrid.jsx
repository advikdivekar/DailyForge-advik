import { useState } from "react";
import { useDroppable, useDndMonitor } from "@dnd-kit/core";
import { Clock } from "lucide-react";

/* ---------------- Constants ---------------- */
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/* Generate hourly slots: 06:00 → 22:00 */
const generateTimeSlots = () => {
  const slots = [];
  let hour = 6;
  while (hour <= 22) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
    hour++;
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

/* Convert HH:mm → minutes */
const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/* Convert minutes → HH:MM */
const minutesToTime = (minutes) => {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
};

/* ---------------- Droppable Cell ---------------- */
function DroppableCell({ day, time, tasks, isDraggingActive }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${day}-${time}`,
    data: {
      day,
      startTime: timeToMinutes(time),
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-12 relative transition-all duration-150 border-b border-r
        ${
          isOver
            ? "bg-[#d0f6e3] border-2 border-dashed border-[#4eb7b3] z-10"
            : isDraggingActive
            ? "bg-white/90 border-[#98e1d7]/60 hover:bg-[#d0f6e3]/40"
            : "bg-white/70 border-[#98e1d7]/30"
        }`}
      role="region"
      aria-label={`${day} at ${time} - Drop zone for scheduling tasks`}
    >
      {/* Drop target hint */}
      {isOver && tasks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[#4eb7b3] text-[10px] font-semibold tracking-wide opacity-80 select-none">
            Drop here
          </span>
        </div>
      )}

      {tasks.map((task) => (
        <div
          key={task.taskId}
          className="absolute inset-1 rounded-lg shadow-sm animate-in
                     flex flex-col items-center justify-center px-1 overflow-hidden
                     border border-[#4eb7b3]/40"
          style={{ backgroundColor: "#4eb7b3" }}
        >
          <span className="text-white text-[9px] opacity-80 flex items-center gap-0.5 leading-none mb-0.5">
            <Clock size={8} />
            {minutesToTime(task.startTime)}
          </span>
          <span className="text-white text-[11px] font-medium truncate w-full text-center leading-tight">
            {task.title}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Weekly Grid ---------------- */
export default function WeeklyGrid({ scheduledTasks, onSaveDay }) {
  const [isDraggingActive, setIsDraggingActive] = useState(false);

  useDndMonitor({
    onDragStart: () => setIsDraggingActive(true),
    onDragEnd: () => setIsDraggingActive(false),
    onDragCancel: () => setIsDraggingActive(false),
  });

  return (
    <div
      className={`card card-primary overflow-x-auto animate-in transition-all duration-200
        ${isDraggingActive ? "ring-2 ring-[#98e1d7] ring-offset-2 shadow-lg" : ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-main">Weekly Schedule</h2>
        {isDraggingActive && (
          <span className="text-xs font-medium text-[#4eb7b3] bg-[#d0f6e3] px-2 py-1 rounded-full animate-in">
            Drop into any time slot
          </span>
        )}
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "80px repeat(7, minmax(120px, 1fr))",
        }}
      >
        {/* ===== Save Buttons Row ===== */}
        <div /> {/* empty time column */}
        {DAYS.map((day) => (
          <div key={`save-${day}`} className="flex justify-center pb-2">
            <button
              onClick={() => onSaveDay(day)}
              className="btn btn-primary px-3 py-1 text-xs cursor-pointer hover-lift"
            >
              Save
            </button>
          </div>
        ))}
        {/* ===== Day Headers ===== */}
        <div />
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-sm font-semibold text-main text-center pb-2 border-b-2 border-[#98e1d7]/50"
          >
            {day}
          </div>
        ))}
        {/* ===== Time Rows ===== */}
        {TIME_SLOTS.map((time) => (
          <div key={time} className="contents">
            {/* Time label */}
            <div className="text-xs text-muted pr-2 pt-3 text-right">
              {time}
            </div>

            {/* Cells */}
            {DAYS.map((day) => (
              <DroppableCell
                key={`${day}-${time}`}
                day={day}
                time={time}
                isDraggingActive={isDraggingActive}
                tasks={scheduledTasks.filter(
                  (t) => t.day === day && t.startTime === timeToMinutes(time)
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
