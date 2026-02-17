function TaskSummary({ tasks }) {
	const total = tasks.length;
	const completed = tasks.filter((t) => t.completed).length;

	return (
		<div className="mt-6 text-center text-sm text-gray-600">
			Total: {total} tarea{total !== 1 ? 's' : ''} | Completadas: {completed}
		</div>
	);
}

export default TaskSummary;
