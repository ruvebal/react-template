/**
 * Checkbox para alternar la visibilidad de tareas completadas.
 * Presentacional: el padre controla el estado (useToggle) y pasa checked + onChange.
 */
function HideCompletedCheckbox({ checked, onChange, label = 'Ocultar tareas completadas' }) {
	return (
		<div className="flex items-center justify-between mb-2">
			<span className="text-sm text-gray-600">
				<label className="inline-flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={checked}
						onChange={onChange}
						className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
					/>
					<span>{label}</span>
				</label>
			</span>
		</div>
	);
}

export default HideCompletedCheckbox;
