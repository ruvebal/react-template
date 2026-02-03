import React from "react";

// Componente presentacional para el botón "Limpiar completadas"
// Props:
// - count: número de tareas completadas (si es 0, no renderiza nada)
// - onClear: función que ejecuta la limpieza
function ClearCompletedButton({ count = 0, onClear }) {
  if (!count) return null; // No mostrar si no hay completadas

  return (
    <div className="mt-4 text-center">
      <button
        onClick={onClear}
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
      >
        🗑️ Limpiar {count} completada{count > 1 ? "s" : ""}
      </button>
    </div>
  );
}

export default ClearCompletedButton;
