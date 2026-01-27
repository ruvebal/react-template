function TaskItem({ task, onRemove, onToggle }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
      {/* Checkbox para alternar completado */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
      />

      {/* Texto de tarea (tachado si está completada) */}
      <span
        className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
      >
        {task.text}
      </span>

      {/* Botón eliminar */}
      <button
        onClick={() => onRemove(task.id)}
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Eliminar
      </button>
    </div>
  );
}

export default TaskItem;