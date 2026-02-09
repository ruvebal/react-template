import TaskItem from "./TaskItem";

function TaskList({ tasks, onRemoveTask, onToggleTask }) {
  // Si no hay tareas, mostrar un mensaje amigable
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">¡Aún no hay tareas. Añade una arriba! 👆</p>
      </div>
    );
  }

  // Renderizar cada tarea usando .map()
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onRemoveTask={onRemoveTask}
          onToggleTask={onToggleTask}
        />
      ))}
    </div>
  );
}

export default TaskList;
