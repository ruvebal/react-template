import { useCallback, useEffect, useMemo, useState } from 'react';
import AddTaskInput from './components/AddTaskInput';
import ClearCompletedButton from './components/ClearCompletedButton';
import ResetAppButton from './components/ResetAppButton';
import SavedIndicator from './components/SavedIndicator';
import HideCompletedCheckbox from './components/HideCompletedCheckbox';
import SearchTasksInput from './components/SearchTasksInput';
import TaskList from './components/TaskList';
import TaskSummary from './components/TaskSummary';
import { useIsFirstRender } from './hooks/useIsFirstRender';
import useToggle from './hooks/useToggle';
import useDebounce from './hooks/useDebounce';

const INITIAL_TASKS = [
	{ id: 1, text: 'Aprender fundamentos de React', completed: false, priority: 'alta' },
	{ id: 2, text: 'Construir una app de tareas', completed: false, priority: 'media' },
	{ id: 3, text: '¡Diviértete con React!', completed: false, priority: 'baja' },
];

const PRIORITY_ORDER = { alta: 0, media: 1, baja: 2 };

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
	// Estado de búsqueda: el input escribe en searchTerm y el hook useDebounce
	// genera una versión estabilizada (debouncedSearch) para no filtrar en cada tecla.
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearch = useDebounce(searchTerm, 300);
	// Estado de UI para ocultar/mostrar tareas completadas. Es puramente visual:
	// no modifica el array original, solo controla qué se renderiza en la lista.
	const [hideCompleted, toggleHideCompleted] = useToggle(false);

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

	// FUNCIÓN: Eliminar una tarea. useCallback con actualizador funcional (setTasks(fn))
	// para no depender de `tasks`: así la referencia es estable (deps []). App sigue
	// re-renderizándose cuando cambia su estado; useCallback no evita eso. Lo que evita
	// es que TaskItem (React.memo) reciba una función "nueva" cada vez y se re-renderice.
	const removeTask = useCallback((id) => {
		setTasks((prev) => prev.filter((task) => task.id !== id));
	}, []);

	// FUNCIÓN: Alternar completado. Igual: actualizador funcional → deps [] → referencia estable para memo.
	const toggleTask = useCallback((id) => {
		setTasks((prev) =>
			prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
		);
	}, []);

	// FUNCIÓN: Eliminar todas las tareas completadas
	const clearCompleted = () => {
		setTasks(tasks.filter((task) => !task.completed));
	};

	// --- Lista visible: filtros + orden por prioridad ---
	// Opción A (sin useMemo): recalculamos en cada render. Correcto y simple; con pocas tareas el coste es negligible.
	// Opción B (useMemo): solo recalculamos cuando cambian tasks, hideCompleted o debouncedSearch. Misma referencia
	// entre renders si las deps no cambian, lo que ayuda si TaskList/hijos usaran React.memo. useCallback no aplica aquí:
	// useCallback memoiza funciones (p. ej. onToggle); useMemo memoiza valores (este array). Ver plan Fase 7.

	// Opción A — cálculo derivado en cada render (dejar comentado como referencia):
	// let visibleTasks = tasks;
	// if (debouncedSearch.trim()) {
	// 	const normalizedSearch = debouncedSearch.toLowerCase();
	// 	visibleTasks = visibleTasks.filter((task) => task.text.toLowerCase().includes(normalizedSearch));
	// }
	// if (hideCompleted) {
	// 	visibleTasks = visibleTasks.filter((task) => !task.completed);
	// }

	const visibleTasks = useMemo(() => {
		let list = tasks;
		if (hideCompleted) list = list.filter((t) => !t.completed);
		if (debouncedSearch.trim()) {
			const q = debouncedSearch.toLowerCase();
			list = list.filter((t) => t.text.toLowerCase().includes(q));
		}
		return [...list].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
	}, [tasks, hideCompleted, debouncedSearch]);

	const hasCompletedTasks = tasks.some((task) => task.completed);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">📝 Mi lista de tareas</h1>

				<SavedIndicator show={!!savedIndicator} message={savedIndicator?.message} />

				<AddTaskInput onAdd={addTask} />

				{/* Mostrar la barra de búsqueda solo si hay más de una tarea.
          Con 0 o 1 tarea, filtrar no tiene efecto práctico. */}
				{tasks.length > 1 && (
					<SearchTasksInput value={searchTerm} onChange={setSearchTerm} />
				)}

				{/* Mostrar el toggle solo si hay al menos una tarea completada.
          Nota pedagógica: la propia UI comunica el estado de los datos; si nada está completado,
          no se ofrece una acción que no tendría efecto. */}
				{hasCompletedTasks && (
					<HideCompletedCheckbox checked={hideCompleted} onChange={toggleHideCompleted} />
				)}

				<TaskList tasks={visibleTasks} onRemoveTask={removeTask} onToggleTask={toggleTask} />

				<ClearCompletedButton count={tasks.filter((t) => t.completed).length} onClear={clearCompleted} />

				<TaskSummary tasks={tasks} />

				<ResetAppButton onReset={handleResetApp} />
			</div>
		</div>
	);
}

export default App;
