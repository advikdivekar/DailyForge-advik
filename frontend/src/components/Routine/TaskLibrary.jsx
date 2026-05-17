import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import useTasks from "../../hooks/useTasks.js";
import EmptyState from "../EmptyState";

const PRIORITY_COLOR = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#10b981",
};

/* ---------------- Draggable Task Item ---------------- */
function DraggableTask({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
      data: {
        task,
      },
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  const priorityColor = PRIORITY_COLOR[task.priority] ?? "#10b981";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group flex items-center gap-2 rounded-xl p-3
                 cursor-grab active:cursor-grabbing
                 transition-all duration-150 hover-lift
                 ${
                   isDragging
                     ? "opacity-40 border-2 border-dashed border-[#4eb7b3] bg-[#d0f6e3]/60 shadow-none"
                     : "border-soft bg-white/80 hover:bg-white hover:shadow-md"
                 }`}
      role="button"
      tabIndex={0}
      aria-label={`${task.title} - Drag to schedule or use arrow keys`}
    >
      {/* Drag handle */}
      <GripVertical
        size={14}
        className="shrink-0 text-muted opacity-30 group-hover:opacity-60 transition-opacity"
      />

      {/* Priority dot */}
      <span
        className="h-2.5 w-2.5 rounded-full shrink-0"
        style={{ backgroundColor: priorityColor }}
      />

      {/* Title */}
      <p className="flex-1 text-sm font-medium text-main truncate">
        {task.title}
      </p>

      {/* Priority badge */}
      <span
        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 opacity-80"
        style={{
          backgroundColor: `${priorityColor}20`,
          color: priorityColor,
        }}
      >
        {task.priority}
      </span>
    </div>
  );
}

/* ---------------- Task Library ---------------- */
export default function TaskLibrary({ onAddTask }) {
  const { tasks } = useTasks();
  
  const [query, setQuery] = useState("");

  const filteredTasks = tasks?.filter((task) =>
    task.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="card card-muted flex flex-col animate-in">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-main">Task Library</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#d0f6e3] text-[#3b8ea0]">
            {filteredTasks?.length ?? 0}
          </span>
        </div>
        <p className="text-xs text-muted mt-0.5">Drag tasks onto the grid</p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search tasks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border-soft pl-8 pr-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#4eb7b3]/40 focus:border-[#4eb7b3]
                     transition-all bg-white"
        />
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted opacity-50"
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      {/* Task List — scrollable, sized to content up to max */}
      <div className="overflow-y-auto max-h-[55vh] min-h-[60px] space-y-2.5 pr-0.5">
        {filteredTasks?.length ? (
          filteredTasks.map((task) => (
            <DraggableTask key={task._id} task={task} />
          ))
        ) : (
          <EmptyState type="tasks" onAction={onAddTask} />
        )}
      </div>

      {/* Footer CTA */}
      <button
        className="btn btn-primary w-full mt-4 cursor-pointer hover-lift"
        onClick={onAddTask}
      >
        + Add Task
      </button>
    </div>
  );
}
