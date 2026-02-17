import { useState, useRef } from "react";

function AddTaskInput({ onAdd }) {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("media"); // 🆕 Estado para prioridad
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (input.trim()) {
      onAdd(input, priority); // 🆕 Pasar la prioridad
      setInput("");
      setPriority("media"); // Reset a prioridad media
      // Tras añadir, devolver el foco al input
      // https://react.dev/learn/referencing-values-with-refs
      inputRef.current?.focus();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex gap-2 mb-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="¿Qué necesitas hacer?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none
                     focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700
                     transition-colors font-medium"
        >
          Añadir
        </button>
      </div>

      {/* 🆕 Selector de prioridad */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600 font-medium">Prioridad:</span>
        <div className="flex gap-2">
          {["baja", "media", "alta"].map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`px-3 py-1 rounded-full transition-all ${
                priority === p
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddTaskInput;
