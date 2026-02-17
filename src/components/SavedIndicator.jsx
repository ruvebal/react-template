/**
 * Indicador visual temporal de "guardado".
 * Solo presentacional: el padre controla cuándo mostrar (show) y el mensaje.
 */
function SavedIndicator({ show = false, message = "✅ Cambios guardados automáticamente" }) {
  if (!show) return null;

  return (
    <div
      className="mb-4 p-2 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center text-sm animate-pulse"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

export default SavedIndicator;
