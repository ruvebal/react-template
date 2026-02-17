import { useEffect, useRef } from 'react';

/**
 * Indica si el componente está en su primer render (antes de que se haya
 * ejecutado cualquier efecto de montaje).
 *
 * Usa useRef para no provocar re-renders al cambiar el valor: la ref
 * persiste entre renders y mutar .current no dispara actualización.
 * El efecto con [] se ejecuta después del primer montaje; hasta entonces
 * (y durante la primera ejecución de otros efectos del mismo montaje)
 * el valor sigue siendo true.
 *
 * Útil para: mensajes distintos en carga vs guardado, omitir animaciones
 * iniciales, evitar una llamada a API en el primer montaje, etc.
 *
 * JSDocs
 *
 * @returns {boolean}
 *   - true: es la primera vez que React está dibujando este componente
 *     (montaje inicial). Aún no se ha ejecutado el useEffect con [] que
 *     cambia la ref, así que "sigue siendo la primera vez".
 *   - false: en cualquier re-render posterior (por setState, cambio de
 *     props, etc.). El efecto con [] ya se ejecutó tras el primer montaje,
 *     así que la ref ya está a false y dejamos de considerar "primera vez".
 *   En resumen: true solo en el primer render; false en todos los demás.
 */
export function useIsFirstRender() {
	const isFirst = useRef(true);

	useEffect(() => {
		// Tras el primer montaje completo, ya no es "primera vez"
		isFirst.current = false;
	}, []);

	return isFirst.current;
}
