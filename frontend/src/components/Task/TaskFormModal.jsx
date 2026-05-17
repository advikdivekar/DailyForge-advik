import { useState, useEffect, useMemo } from "react";
import { X, Sparkles } from "lucide-react";
import { CATEGORIES } from "../../utils/categoryUtils";

const priorities = ["Low", "Medium", "High"];

const QUOTES = [
  "Small steps lead to big changes.",
  "A goal without a plan is just a wish.",
  "Done is better than perfect.",
  "Focus on progress, not perfection.",
  "Clarity leads to confidence.",
  "Start where you are. Use what you have.",
  "One task at a time builds a great life.",
];

export default function TaskFormModal({ task, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");

  const quote = useMemo(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
    []
  );

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setTags(Array.isArray(task.tags) ? task.tags : []);
      setPriority(task.priority || "Low");
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    if (!priority) return alert("Priority is required");
    if (!dueDate) return alert("Due date is required");

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      tags,
      priority,
      dueDate,
    });
  };

  const toggleCategory = (categoryName) => {
    setTags((prev) =>
      prev.includes(categoryName)
        ? prev.filter((t) => t !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center
                 pt-[6vh] px-4 pb-6 overflow-y-auto animate-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in delay-100 overflow-hidden">

        {/* ── Gradient header ── */}
        <div
          className="px-6 py-5 flex items-start justify-between"
          style={{ background: "linear-gradient(135deg, #4eb7b3 0%, #98e1d7 100%)" }}
        >
          <div className="flex-1 pr-4">
            <p className="text-white/70 text-[11px] font-semibold tracking-widest uppercase mb-1">
              {task ? "Edit Task" : "New Task"}
            </p>
            <div className="flex items-start gap-1.5">
              <Sparkles size={13} className="text-white/80 mt-0.5 shrink-0" />
              <p className="text-white text-sm italic leading-snug opacity-90">
                "{quote}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* ── Form body ── */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-main uppercase tracking-wide">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 border border-soft rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#4eb7b3]/40 focus:border-[#4eb7b3]
                         transition-all"
              placeholder="What needs to be done?"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-main uppercase tracking-wide">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 border border-soft rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#4eb7b3]/40 focus:border-[#4eb7b3]
                         transition-all resize-none"
              placeholder="Add details (optional)"
              rows={2}
              maxLength={300}
            />
            <p
              className={`text-xs mt-0.5 text-right ${
                description.length >= 300
                  ? "text-red-500"
                  : description.length >= 250
                  ? "text-yellow-500"
                  : "text-gray-400"
              }`}
            >
              {description.length}/300
            </p>
          </div>

          {/* Priority + Due Date — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-main uppercase tracking-wide">
                Priority <span className="text-red-400">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full mt-1.5 px-3 py-2 border border-soft rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#4eb7b3]/40 focus:border-[#4eb7b3]
                           transition-all bg-white"
                required
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-main uppercase tracking-wide">
                Due Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full mt-1.5 px-3 py-2 border border-soft rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#4eb7b3]/40 focus:border-[#4eb7b3]
                           transition-all"
                required
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-semibold text-main uppercase tracking-wide">
              Categories
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CATEGORIES.map((category) => {
                const isSelected = tags.includes(category.name);
                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => toggleCategory(category.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? "ring-2 ring-offset-1 shadow-sm"
                        : "opacity-55 hover:opacity-90"
                    }`}
                    style={{
                      backgroundColor: category.bgColor,
                      color: category.color,
                      ringColor: isSelected ? category.color : undefined,
                    }}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full btn btn-primary py-2.5 hover-lift font-semibold tracking-wide mt-1"
          >
            {task ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
