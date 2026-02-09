import { useState } from "react";
import TaskList from "./components/TaskList";
import AddTaskInput from "./components/AddTaskInput";
import ClearCompletedButton from "./components/ClearCompletedButton";

function App() {
  // ESTADO: La lista de tareas (esta es la memoria de nuestra app)
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Aprender fundamentos de React",
      completed: false,
      priority: "alta",
    },
    {
      id: 2,
      text: "Construir una app de tareas",
      completed: false,
      priority: "media",
    },
    {
      id: 3,
      text: "¡Diviértete con React!",
      completed: false,
      priority: "baja",
    },
  ]);

  // FUNCIÓN: Añadir una nueva tarea
  const addTask = (text, priority = "media") => {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false,
      priority: priority, // 🆕 Usar la prioridad recibida
    };
    setTasks([...tasks, newTask]);
  };

  // FUNCIÓN: Eliminar una tarea
  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // FUNCIÓN: Alternar completado de tarea
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // FUNCIÓN: Eliminar todas las tareas completadas
  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          📝 Mi lista de tareas
        </h1>

        <AddTaskInput onAdd={addTask} />

        <TaskList
          tasks={tasks}
          onRemoveTask={removeTask}
          onToggleTask={toggleTask}
        />

        <ClearCompletedButton
          count={tasks.filter((t) => t.completed).length}
          onClear={clearCompleted}
        />

        <div className="mt-6 text-center text-sm text-gray-600">
          Total: {tasks.length} tareas | Completadas:{" "}
          {tasks.filter((t) => t.completed).length}
        </div>
      </div>
    </div>
  );
}

export default App;
