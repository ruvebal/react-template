/**
 * Botón para resetear la aplicación (borrar todas las tareas de localStorage).
 * Pide confirmación antes de llamar a onReset.
 */
function ResetAppButton({
  onReset,
  confirmMessage = "⚠️ ¿Seguro que quieres eliminar todas las tareas? Esta acción no se puede deshacer.",
  label = "🗑️ Resetear aplicación (borrar todo)",
}) {
  const handleClick = () => {
    if (window.confirm(confirmMessage)) {
      onReset();
    }
  };

  return (
    <div className="mt-4 text-center">
      <button
        type="button"
        onClick={handleClick}
        className="text-sm text-gray-500 hover:text-red-600 underline"
      >
        {label}
      </button>
    </div>
  );
}

export default ResetAppButton;
