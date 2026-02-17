import { useState } from "react";

/**
 * Hook que sincroniza un valor con localStorage.
 * Soporta inicialización perezosa (solo lee de localStorage en el primer render)
 * y setter funcional setValue(prev => next).
 *
 * @param {string} key - Clave en localStorage
 * @param {T} initialValue - Valor si no hay nada guardado o hay error al parsear
 * @returns {[T, (value: T | ((prev: T) => T)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
