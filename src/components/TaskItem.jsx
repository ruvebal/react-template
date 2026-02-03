function TaskItem({ task, onRemoveTask, onToggleTask }) {
  // 🆕 Mapeo de prioridades a colores
  const priorityStyles = {
    baja: "border-l-4 border-green-500 bg-green-50",
    media: "border-l-4 border-yellow-500 bg-yellow-50",
    alta: "border-l-4 border-red-500 bg-red-50",
  };

  // 🆕 Iconos para cada prioridad
  const priorityIcons = {
    baja: "🟢",
    media: "🟡",
    alta: "🔴",
  };

  return (
    <div
      className={`rounded-lg shadow-sm p-4 flex items-center gap-3 hover:shadow-md
                     transition-shadow ${priorityStyles[task.priority]}`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleTask(task.id)}
        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
      />

      <span className="text-xs">{priorityIcons[task.priority]}</span>

      <span
        className={`flex-1 ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
      >
        {task.text}
      </span>

      {/* 🆕 Badge de prioridad */}
      <span
        className={`text-xs px-2 py-1 rounded-full font-medium ${
          task.priority === "alta"
            ? "bg-red-200 text-red-800"
            : task.priority === "media"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-green-200 text-green-800"
        }`}
      >
        {task.priority}
      </span>

      <button
        onClick={() => onRemoveTask(task.id)}
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600
                   transition-colors"
      >
        Eliminar
      </button>
    </div>
  );
}

export default TaskItem;
