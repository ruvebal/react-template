import { useEffect, useState } from 'react';
import AddTaskInput from './components/AddTaskInput';
import ClearCompletedButton from './components/ClearCompletedButton';
import ResetAppButton from './components/ResetAppButton';
import SavedIndicator from './components/SavedIndicator';
import TaskList from './components/TaskList';
import TaskSummary from './components/TaskSummary';
import { useIsFirstRender } from './hooks/useIsFirstRender';
import { useDebounce } from './hooks/useDebounce';

const INITIAL_TASKS = [
	{ id: 1, text: 'Aprender fundamentos de React', completed: false, priority: 'alta' },
	{ id: 2, text: 'Construir una app de tareas', completed: false, priority: 'media' },
	{ id: 3, text: '¡Diviértete con React!', completed: false, priority: 'baja' },
];

function getInitialTasks() {
	try {
		const savedTasks = localStorage.getItem('tasks');
		if (savedTasks) return JSON.parse(savedTasks);
	} catch (error) {
		console.error('Error al cargar tareas:', error);
	}
	return INITIAL_TASKS;
}

function App() {
	const [tasks, setTasks] = useState(getInitialTasks);
	const [savedIndicator, setSavedIndicator] = useState(null); // null = oculto; { message } = mostrar
	const isFirstRender = useIsFirstRender();

	// Nuevo estado para búsqueda y valor debounced
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearch = useDebounce(searchTerm, 300);

	// Filtrar tareas según la búsqueda debounced
	const filteredTasks = tasks.filter((t) =>
		t.text.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
	);

	// Persistencia en localStorage y mensaje según si es carga inicial o guardado posterior.
	// isFirstRender no va en dependencias: solo debe influir en la primera ejecución del efecto
	// (montaje). Si lo añadiéramos, al pasar a false se re-ejecutaría el efecto y mostraría
	// "Cambios guardados" justo después de "Lista restaurada".
	useEffect(() => {
		try {
			localStorage.setItem('tasks', JSON.stringify(tasks));
			const message = isFirstRender
				? '✅ Lista restaurada'
				: '✅ Cambios guardados automáticamente';
			setSavedIndicator({ message });
			const timer = setTimeout(() => setSavedIndicator(null), 2000);
			return () => clearTimeout(timer);
		} catch (error) {
			console.error('Error al guardar tareas:', error);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- isFirstRender solo para la primera ejecución
	}, [tasks]);

	const handleResetApp = () => {
		localStorage.removeItem('tasks');
		setTasks([]);
	};

	// FUNCIÓN: Añadir una nueva tarea
	const addTask = (text, priority = 'media') => {
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
		setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
	};

	// FUNCIÓN: Eliminar todas las tareas completadas
	const clearCompleted = () => {
		setTasks(tasks.filter((task) => !task.completed));
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">📝 Mi lista de tareas</h1>

				<SavedIndicator show={!!savedIndicator} message={savedIndicator?.message} />

				{/* Buscador de tareas */}
				<div className="mb-4">
					<input
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Buscar tareas..."
						className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
					/>
				</div>

				<AddTaskInput onAdd={addTask} />

				<TaskList tasks={filteredTasks} onRemoveTask={removeTask} onToggleTask={toggleTask} />

				<ClearCompletedButton count={tasks.filter((t) => t.completed).length} onClear={clearCompleted} />

				<TaskSummary tasks={tasks} />

				<ResetAppButton onReset={handleResetApp} />
			</div>
		</div>
	);
}

export default App;
