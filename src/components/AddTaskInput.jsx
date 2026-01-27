import { useState } from 'react';

function AddTaskInput({ onAdd }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue); // Llamar función del padre
      setInputValue(''); // Limpiar input
    }
  };

  const handleKeyDown = (e) => {
    // Permitir tecla Enter para añadir tarea (como haría un formulario)
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="mb-6 flex gap-2">
      {/* onChange: Se dispara cada vez que el usuario escribe
          e = objeto evento (contiene info sobre lo que pasó)
          e.target = el elemento DOM que disparó el evento (este input)
          e.target.value = el texto actual escrito en el input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="¿Qué necesitas hacer?"
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleAdd}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Añadir
      </button>
    </div>
  );
}

export default AddTaskInput;