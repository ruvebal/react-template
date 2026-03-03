# 📋 Plan de Implementación: Ejercicios React Fundamentales

> **Propósito Pedagógico:** Este plan está diseñado para reforzar los conceptos fundamentales de React mediante ejercicios progresivos que incrementan la complejidad paso a paso.

---

## 📚 Tabla de Contenidos

- [Visión General](#-visión-general)
- [Conceptos React Cubiertos](#-conceptos-react-cubiertos)
- [Virtual DOM (vDOM)](#-virtual-dom-vdom)
- [Estructura Actual del Proyecto](#-estructura-actual-del-proyecto)
- [Fase 1: Botón "Limpiar Completadas"](#-fase-1-botón-limpiar-completadas)
- [Fase 2: Sistema de Prioridades](#-fase-2-sistema-de-prioridades)
- [Fase 3: Persistencia con localStorage](#-fase-3-persistencia-con-localstorage)
- [Bloque Hooks: Lección asociada](#-bloque-hooks-lección-asociada)
- [Fase 4: Custom hook useLocalStorage](#-fase-4-custom-hook-uselocalstorage)
- [Fase 5: useDebounce y búsqueda de tareas](#-fase-5-usedebounce-y-búsqueda-de-tareas)
- [Fase 6: useRef y useToggle](#-fase-6-useref-y-usetoggle)
- [Fase 7: useMemo y useCallback (optimización)](#-fase-7-usememo-y-usecallback-optimización)
- [Resumen de Conceptos por Fase](#-resumen-de-conceptos-por-fase)
- [Recursos Adicionales](#-recursos-adicionales)

---

## 🎯 Visión General

Este documento describe la implementación de **ejercicios progresivos** para una aplicación de gestión de tareas en React: **Fases 1–3** (fundamentos) y **Fases 4–7** (dominio de hooks), alineados con la lección **Dominio de hooks** (ruta en [Bloque Hooks](#-bloque-hooks-lección-asociada)).

### Objetivos de Aprendizaje Globales

1. **Virtual DOM (vDOM)** y su relación con la inmutabilidad
2. **Manipulación avanzada del estado** con `useState`
3. **Efectos secundarios** y ciclo de vida con `useEffect`
4. **Renderizado condicional** y estilos dinámicos
5. **Persistencia de datos** en el navegador
6. **Patrones de inmutabilidad** en JavaScript
7. **Custom hooks** reutilizables (`useLocalStorage`, `useDebounce`, `useToggle`)
8. **useRef** para referencias al DOM y valores mutables
9. **useMemo** y **useCallback** para optimización (con criterio)

### Prerrequisitos

- ✅ Comprensión básica de `useState`
- ✅ Sintaxis de JavaScript ES6+ (arrow functions, destructuring, spread operator)
- ✅ Conocimiento de métodos de arrays (`.map()`, `.filter()`)
- ✅ Tailwind CSS para estilos (ya configurado)

---

## 🧩 Conceptos React Cubiertos

| Concepto                              | F1  | F2  | F3  | F4  | F5  | F6  | F7  |
| ------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
| Virtual DOM (vDOM) - Fundamentos      | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  |
| `useState` - Estado básico            | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  |
| Actualización inmutable del estado    | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  |
| Props y comunicación componente-padre | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  |
| Renderizado condicional               | ✅  | ✅  | ✅  | -   | ✅  | ✅  | -   |
| Estilos dinámicos con clases CSS      | -   | ✅  | -   | -   | -   | -   | -   |
| `useEffect` - Efectos secundarios     | -   | -   | ✅  | ✅  | ✅  | -   | -   |
| Sincronización con APIs externas      | -   | -   | ✅  | ✅  | -   | -   | -   |
| Serialización JSON                    | -   | -   | ✅  | ✅  | -   | -   | -   |
| **Custom hooks**                      | -   | -   | -   | ✅  | ✅  | ✅  | -   |
| `useRef`                              | -   | -   | -   | -   | -   | ✅  | -   |
| `useMemo` / `useCallback`             | -   | -   | -   | -   | -   | -   | ✅  |
| Cleanup en efectos                    | -   | -   | -   | -   | ✅  | -   | -   |

---

## 🌐 Virtual DOM (vDOM)

### ¿Qué es el Virtual DOM?

El **Virtual DOM** (vDOM) es una representación ligera en memoria del DOM real. React mantiene una copia "virtual" del árbol de elementos del documento y **solo actualiza el DOM real cuando es necesario**, minimizando operaciones costosas.

### ¿Por qué existe?

Manipular el DOM directamente es **lento** porque cada cambio puede provocar recálculos de layout, repaint y reflow. React evita esto:

1. **Render:** Cuando el estado cambia, React genera un **nuevo árbol vDOM** (representación de cómo debería verse la UI).
2. **Diffing:** React compara el nuevo vDOM con el anterior (**reconciliación**).
3. **Commit:** Solo aplica al DOM real las **diferencias mínimas** necesarias.

```
Estado cambia → Nuevo vDOM → Diff con vDOM anterior → Patch del DOM real
```

### Relación con la inmutabilidad

El vDOM explica **por qué React exige inmutabilidad**:

- React compara **referencias** de objetos para detectar cambios.
- Si mutas un objeto en lugar de crear uno nuevo, la referencia no cambia → React no detecta el cambio → no re-renderiza.
- Con `setTasks([...tasks, newTask])` creas un **nuevo array** → nueva referencia → React detecta el cambio → re-renderiza correctamente.

**En resumen:** El vDOM y la reconciliación son la razón técnica detrás de la regla "nunca mutes el estado directamente".

### Recursos

- [React Docs: Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [React Docs: Render and Commit](https://react.dev/learn/render-and-commit)

---

## 📁 Estructura Actual del Proyecto

```
react-template/
├── src/
│   ├── App.jsx                 # Componente principal (contiene el estado)
│   ├── components/
│   │   ├── AddTaskInput.jsx    # Input para añadir tareas
│   │   ├── TaskItem.jsx        # Componente individual de tarea
│   │   └── TaskList.jsx        # Lista de tareas
│   └── index.css               # Estilos globales (Tailwind)
└── docs/
    └── plan-ejercicios-react.md # Este documento
```

### Estado Actual de la Aplicación

```jsx
// Estructura del estado en App.jsx
const [tasks, setTasks] = useState([
	{
		id: 1,
		text: 'Aprender fundamentos de React',
		completed: false,
	},
	// ...más tareas
]);
```

**Funcionalidades existentes:**

- ✅ Añadir tareas nuevas
- ✅ Eliminar tareas individuales
- ✅ Marcar/desmarcar tareas como completadas
- ✅ Contador de tareas totales y completadas

---

## 🚀 Fase 1: Botón "Limpiar Completadas"

### 🎓 Objetivos de Aprendizaje

- Reforzar el uso de **`.filter()`** para manipulación de arrays
- Practicar **actualización inmutable del estado**
- Implementar **renderizado condicional** (mostrar botón solo si hay tareas completadas)
- Mejorar la experiencia de usuario con **feedback visual**

### 🧠 Conceptos React Clave

#### 1. Inmutabilidad en React

React detecta cambios comparando referencias de objetos (ver [Virtual DOM](#-virtual-dom-vdom)). Por eso **nunca mutamos el estado directamente**:

```jsx
// ❌ INCORRECTO - Mutación directa
tasks = tasks.filter((task) => !task.completed);

// ✅ CORRECTO - Crear nuevo array
setTasks(tasks.filter((task) => !task.completed));
```

#### 2. Renderizado Condicional

Mostrar el botón solo cuando tiene sentido:

```jsx
{
	tasks.some((t) => t.completed) && <button onClick={clearCompleted}>Limpiar completadas</button>;
}
```

**Explicación:** `.some()` devuelve `true` si al menos una tarea está completada.

### 📋 Pasos de Implementación

#### Paso 1.1: Crear la función `clearCompleted` en `App.jsx`

**Ubicación:** Después de la función `toggleTask`

```jsx
// FUNCIÓN: Eliminar todas las tareas completadas
const clearCompleted = () => {
	setTasks(tasks.filter((task) => !task.completed));
};
```

**Análisis del código:**

- `tasks.filter(...)` crea un **nuevo array** (inmutabilidad)
- `!task.completed` mantiene solo las tareas **NO completadas**
- `setTasks(...)` actualiza el estado con el nuevo array

#### Paso 1.2: Añadir el botón en la UI

**Ubicación:** En el `return` de `App.jsx`, después del componente `<TaskList />`

```jsx
{
	/* Botón para limpiar completadas (solo visible si hay alguna) */
}
{
	tasks.some((t) => t.completed) && (
		<div className="mt-4 text-center">
			<button
				onClick={clearCompleted}
				className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600
                 transition-colors shadow-md hover:shadow-lg">
				🗑️ Limpiar completadas
			</button>
		</div>
	);
}
```

**Clases Tailwind explicadas:**

- `px-6 py-2`: Padding horizontal y vertical
- `bg-red-500`: Color de fondo rojo
- `hover:bg-red-600`: Color más oscuro al pasar el ratón
- `transition-colors`: Animación suave del cambio de color
- `shadow-md`: Sombra mediana
- `hover:shadow-lg`: Sombra más grande al hover (efecto 3D)

#### Paso 1.2b: Extraer el botón a un componente reutilizable

En lugar de dejar el markup del botón directamente en `App.jsx`, podemos extraerlo a un componente dentro de `src/components` para mejorar la legibilidad y la reutilización.

- Archivo sugerido: `src/components/ClearCompletedButton.jsx`

Ejemplo de componente:

```jsx
import React from 'react';

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
				className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg">
				🗑️ Limpiar {count} completada{count > 1 ? 's' : ''}
			</button>
		</div>
	);
}

export default ClearCompletedButton;
```

Ejemplo de uso en `App.jsx` (reemplaza el bloque del botón):

```jsx
import ClearCompletedButton from './components/ClearCompletedButton';

// ...existing code...

// Dentro del return, después de <TaskList />
<ClearCompletedButton count={tasks.filter((t) => t.completed).length} onClear={clearCompleted} />;

// ...existing code...
```

Ventajas de extraer el componente:

- Mejora la separación de responsabilidades (UI vs lógica de estado)
- Facilita pruebas y reutilización
- Permite añadir comportamientos adicionales (confirmaciones, animaciones) sin ensuciar `App.jsx`

#### Paso 1.3: Mejorar el feedback visual (opcional)

Añadir un contador de tareas completadas al botón:

```jsx
<button onClick={clearCompleted}>🗑️ Limpiar {tasks.filter((t) => t.completed).length} completadas</button>
```

### ✅ Criterios de Aceptación

- [ ] El botón solo aparece cuando hay al menos una tarea completada
- [ ] Al hacer clic, todas las tareas completadas se eliminan
- [ ] Las tareas no completadas permanecen intactas
- [ ] El contador de tareas se actualiza correctamente
- [ ] El botón tiene un estilo visual atractivo con efecto hover

### 🧪 Casos de Prueba

1. **Sin tareas completadas:** El botón NO debe aparecer
2. **Con 2 tareas completadas de 5:** Al hacer clic, quedan 3 tareas
3. **Todas las tareas completadas:** Al hacer clic, se muestra el mensaje "¡Aún no hay tareas!"

### 📝 Prompt para Implementación

```
Implementa la Fase 1 del plan de ejercicios React ubicado en:
/Users/ruvebal/projects/ruvebal/scholar/udit/courses-repos/react-template/docs/plan-ejercicios-react.md

TAREA: Añadir un botón "Limpiar completadas" que elimine todas las tareas marcadas como completadas.

REQUISITOS:
1. Crear la función clearCompleted() en App.jsx
2. Añadir el botón en la UI con renderizado condicional
3. Aplicar estilos Tailwind atractivos con efecto hover
4. El botón solo debe aparecer si hay tareas completadas

FOCO PEDAGÓGICO:
- Explicar por qué usamos .filter() y no .splice()
- Comentar el código para demostrar inmutabilidad
- Usar .some() para el renderizado condicional

ENTREGABLE:
- Código implementado en App.jsx
- Reporte de implementación siguiendo el formato del plan
- Captura o descripción del resultado visual
```

---

## 🎨 Fase 2: Sistema de Prioridades

### 🎓 Objetivos de Aprendizaje

- Extender el **modelo de datos** con nuevas propiedades
- Implementar **estilos dinámicos** basados en estado
- Practicar **condicionales en JSX** para renderizado
- Mejorar la **arquitectura de componentes** con props adicionales
- Trabajar con **enums/constantes** para valores predefinidos

### 🧠 Conceptos React Clave

#### 1. Extensión del Modelo de Datos

Añadimos una propiedad `priority` a cada tarea:

```jsx
{
  id: 1,
  text: 'Tarea urgente',
  completed: false,
  priority: 'alta' // 🆕 Nueva propiedad
}
```

**Valores válidos:** `'baja'`, `'media'`, `'alta'`

#### 2. Estilos Dinámicos con Clases Condicionales

React permite construir clases CSS dinámicamente:

```jsx
// Opción 1: Template strings
className={`base-class ${priority === 'alta' ? 'text-red-600' : 'text-gray-600'}`}

// Opción 2: Objeto de mapeo (más limpio)
const priorityColors = {
  baja: 'border-l-4 border-green-500',
  media: 'border-l-4 border-yellow-500',
  alta: 'border-l-4 border-red-500'
};
className={priorityColors[task.priority]}
```

### 📋 Pasos de Implementación

#### Paso 2.1: Actualizar el estado inicial con prioridades

**Ubicación:** En `App.jsx`, modificar el `useState` inicial:

```jsx
const [tasks, setTasks] = useState([
	{
		id: 1,
		text: 'Aprender fundamentos de React',
		completed: false,
		priority: 'alta', // 🆕 Añadir prioridad
	},
	{
		id: 2,
		text: 'Construir una app de tareas',
		completed: false,
		priority: 'media', // 🆕
	},
]);
```

#### Paso 2.2: Modificar la función `addTask`

Añadir una prioridad por defecto al crear tareas:

```jsx
const addTask = (text) => {
	const newTask = {
		id: Date.now(),
		text: text,
		completed: false,
		priority: 'media', // 🆕 Prioridad por defecto
	};
	setTasks([...tasks, newTask]);
};
```

#### Paso 2.3: Crear selector de prioridad en `AddTaskInput.jsx`

**Actualización del componente:**

```jsx
import { useState } from 'react';

function AddTaskInput({ onAdd }) {
	const [input, setInput] = useState('');
	const [priority, setPriority] = useState('media'); // 🆕 Estado para prioridad

	const handleSubmit = () => {
		if (input.trim()) {
			onAdd(input, priority); // 🆕 Pasar la prioridad
			setInput('');
			setPriority('media'); // Reset a prioridad media
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-4 mb-6">
			<div className="flex gap-2 mb-2">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
					placeholder="¿Qué necesitas hacer?"
					className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none
                     focus:ring-2 focus:ring-indigo-500"
				/>
				<button
					onClick={handleSubmit}
					className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700
                     transition-colors font-medium">
					Añadir
				</button>
			</div>

			{/* 🆕 Selector de prioridad */}
			<div className="flex items-center gap-2 text-sm">
				<span className="text-gray-600 font-medium">Prioridad:</span>
				<div className="flex gap-2">
					{['baja', 'media', 'alta'].map((p) => (
						<button
							key={p}
							onClick={() => setPriority(p)}
							className={`px-3 py-1 rounded-full transition-all ${
								priority === p ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}>
							{p.charAt(0).toUpperCase() + p.slice(1)}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

export default AddTaskInput;
```

**Conceptos clave:**

- **Segundo estado local:** `useState` para la prioridad seleccionada
- **Renderizado de botones dinámico:** `.map()` sobre el array de prioridades
- **Estilos condicionales:** Clase diferente cuando `priority === p`

#### Paso 2.4: Actualizar `App.jsx` para recibir prioridad

Modificar la función `addTask`:

```jsx
const addTask = (text, priority = 'media') => {
	const newTask = {
		id: Date.now(),
		text: text,
		completed: false,
		priority: priority, // 🆕 Usar la prioridad recibida
	};
	setTasks([...tasks, newTask]);
};
```

#### Paso 2.5: Añadir indicadores visuales en `TaskItem.jsx`

Mostrar la prioridad con colores:

```jsx
function TaskItem({ task, onRemove, onToggle }) {
	// 🆕 Mapeo de prioridades a colores
	const priorityStyles = {
		baja: 'border-l-4 border-green-500 bg-green-50',
		media: 'border-l-4 border-yellow-500 bg-yellow-50',
		alta: 'border-l-4 border-red-500 bg-red-50',
	};

	// 🆕 Iconos para cada prioridad
	const priorityIcons = {
		baja: '🟢',
		media: '🟡',
		alta: '🔴',
	};

	return (
		<div
			className={`rounded-lg shadow-sm p-4 flex items-center gap-3 hover:shadow-md
                     transition-shadow ${priorityStyles[task.priority]}`}>
			<input
				type="checkbox"
				checked={task.completed}
				onChange={() => onToggle(task.id)}
				className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
			/>

			<span className="text-xs">{priorityIcons[task.priority]}</span>

			<span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.text}</span>

			{/* 🆕 Badge de prioridad */}
			<span
				className={`text-xs px-2 py-1 rounded-full font-medium ${
					task.priority === 'alta'
						? 'bg-red-200 text-red-800'
						: task.priority === 'media'
							? 'bg-yellow-200 text-yellow-800'
							: 'bg-green-200 text-green-800'
				}`}>
				{task.priority}
			</span>

			<button
				onClick={() => onRemove(task.id)}
				className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600
                   transition-colors">
				Eliminar
			</button>
		</div>
	);
}

export default TaskItem;
```

**Técnicas de estilo:**

- **Border-left coloreado:** Indicador visual rápido de prioridad
- **Fondos sutiles:** `bg-green-50`, `bg-yellow-50`, `bg-red-50`
- **Badges:** Pequeñas etiquetas de prioridad
- **Iconos emoji:** Refuerzo visual adicional

#### Paso 2.6: Ordenar tareas por prioridad (opcional)

En `App.jsx`, ordenar antes de renderizar:

```jsx
// 🆕 Función helper para ordenar por prioridad
const priorityOrder = { alta: 1, media: 2, baja: 3 };

const sortedTasks = [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

return (
	<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
		{/* ... */}
		<TaskList
			tasks={sortedTasks} // 🆕 Pasar tareas ordenadas
			onRemove={removeTask}
			onToggle={toggleTask}
		/>
	</div>
);
```

### ✅ Criterios de Aceptación

- [ ] Cada tarea tiene una propiedad `priority` con valores `'baja'`, `'media'`, `'alta'`
- [ ] El componente `AddTaskInput` permite seleccionar la prioridad
- [ ] Las tareas se visualizan con colores según su prioridad (verde/amarillo/rojo)
- [ ] El indicador de prioridad es claro y visible (border, badge o icono)
- [ ] (Opcional) Las tareas se ordenan por prioridad automáticamente

### 🧪 Casos de Prueba

1. **Crear tarea con prioridad alta:** Debe mostrarse con borde rojo
2. **Crear tarea con prioridad baja:** Debe mostrarse con borde verde
3. **Selector de prioridad:** Al hacer clic en "Alta", debe quedar seleccionado visualmente
4. **Reset del selector:** Después de añadir una tarea, debe volver a "Media"
5. **Ordenamiento (si implementado):** Las tareas altas deben aparecer primero

### 📝 Prompt para Implementación

```
Implementa la Fase 2 del plan de ejercicios React ubicado en:
/Users/ruvebal/projects/ruvebal/scholar/udit/courses-repos/react-template/docs/plan-ejercicios-react.md

TAREA: Añadir un sistema de prioridades (baja, media, alta) a las tareas con indicadores visuales.

REQUISITOS:
1. Extender el modelo de datos con la propiedad priority
2. Crear selector de prioridad en AddTaskInput.jsx
3. Actualizar addTask() para recibir la prioridad
4. Añadir estilos visuales en TaskItem.jsx (colores, badges, borders)
5. (OPCIONAL) Implementar ordenamiento automático por prioridad

FOCO PEDAGÓGICO:
- Explicar cómo extender el estado sin romper la inmutabilidad
- Demostrar estilos dinámicos con objetos de mapeo
- Comentar el uso de múltiples estados en AddTaskInput
- Mostrar cómo pasar datos adicionales entre componentes (props)

ESTILO:
- Usar Tailwind CSS para los indicadores visuales
- Aplicar colores: verde (baja), amarillo (media), rojo (alta)
- Añadir transiciones suaves

ENTREGABLE:
- Código actualizado en App.jsx, AddTaskInput.jsx y TaskItem.jsx
- Reporte de implementación con capturas de las prioridades visuales
- Explicación de las decisiones de diseño
```

---

## 💾 Fase 3: Persistencia con localStorage

### 🎓 Objetivos de Aprendizaje

- Introducción a **`useEffect`** y el ciclo de vida de componentes
- Comprender los **efectos secundarios** (side effects)
- Trabajar con **APIs del navegador** (localStorage)
- Implementar **sincronización bidireccional** estado ↔ storage
- Manejar **serialización/deserialización JSON**
- Gestionar **dependencias de efectos**

### 🧠 Conceptos React Clave

#### 1. ¿Qué es `useEffect`?

`useEffect` ejecuta código **después de que el componente se renderiza**. Es ideal para:

- Llamadas a APIs
- Suscripciones a eventos
- Interacciones con el DOM
- **Sincronización con sistemas externos** (como localStorage)

**Sintaxis básica:**

```jsx
useEffect(() => {
	// Código que se ejecuta después del render
	console.log('Componente renderizado');

	// Opcionalmente, devolver función de limpieza
	return () => {
		console.log('Componente desmontado');
	};
}, [dependencias]); // Array de dependencias
```

#### 2. Array de Dependencias

El segundo parámetro de `useEffect` controla **cuándo se ejecuta**:

| Array de dependencias | Cuándo se ejecuta el efecto               |
| --------------------- | ----------------------------------------- |
| `[]` (vacío)          | Solo una vez (al montar el componente)    |
| `[state1, state2]`    | Cada vez que `state1` o `state2` cambian  |
| Sin array             | Después de **cada** render (¡cuidado! 🚨) |

#### 3. localStorage API

El navegador proporciona `localStorage` para guardar datos persistentes:

```javascript
// Guardar
localStorage.setItem('clave', 'valor'); // Solo acepta strings

// Leer
const valor = localStorage.getItem('clave'); // Devuelve string o null

// Eliminar
localStorage.removeItem('clave');

// Limpiar todo
localStorage.clear();
```

**⚠️ Importante:** localStorage solo almacena **strings**, por eso necesitamos JSON:

```javascript
// Guardar objeto
localStorage.setItem('tasks', JSON.stringify(tasks));

// Leer objeto
const tasks = JSON.parse(localStorage.getItem('tasks'));
```

### 📋 Pasos de Implementación

#### Paso 3.1: Cargar tareas desde localStorage al iniciar

**Ubicación:** En `App.jsx`, modificar el `useState`:

```jsx
import { useState, useEffect } from 'react'; // 🆕 Importar useEffect

function App() {
	// 🆕 Función para obtener tareas iniciales
	const getInitialTasks = () => {
		try {
			const savedTasks = localStorage.getItem('tasks');

			// Si hay tareas guardadas, parsearlas
			if (savedTasks) {
				return JSON.parse(savedTasks);
			}
		} catch (error) {
			// Si hay error al parsear, usar tareas por defecto
			console.error('Error al cargar tareas:', error);
		}

		// Tareas por defecto si no hay nada guardado
		return [
			{
				id: 1,
				text: 'Aprender fundamentos de React',
				completed: false,
				priority: 'alta',
			},
			{
				id: 2,
				text: 'Construir una app de tareas',
				completed: false,
				priority: 'media',
			},
		];
	};

	// 🆕 Usar función lazy initialization
	const [tasks, setTasks] = useState(getInitialTasks);

	// ... resto del código
}
```

**Conceptos clave:**

- **Lazy initialization:** Pasar una función a `useState` que se ejecuta **solo una vez**
- **Try-catch:** Protegernos de errores si el JSON está corrupto
- **Fallback:** Devolver tareas por defecto si no hay datos guardados

#### Paso 3.2: Sincronizar localStorage cada vez que cambien las tareas

Añadir el `useEffect` después del `useState`:

```jsx
// 🆕 EFECTO: Guardar tareas en localStorage cada vez que cambien
useEffect(() => {
	try {
		localStorage.setItem('tasks', JSON.stringify(tasks));
		console.log('✅ Tareas guardadas en localStorage:', tasks.length);
	} catch (error) {
		console.error('❌ Error al guardar tareas:', error);
	}
}, [tasks]); // 🔑 Dependencia: se ejecuta cada vez que tasks cambie
```

**Análisis del código:**

- **Dependencia `[tasks]`:** El efecto se ejecuta cada vez que el estado `tasks` cambia
- **JSON.stringify(tasks):** Convierte el array a string
- **Try-catch:** Maneja errores (ej: límite de almacenamiento excedido)
- **Console.log:** Útil para debugging (opcional en producción)

#### Paso 3.3: Componente de feedback visual de guardado (opcional)

**Componentizar:** Crear un componente reutilizable que muestre un mensaje temporal de "guardado".

- **Archivo:** `src/components/SavedIndicator.jsx`
- **Props:** `show` (boolean), opcionalmente `message` (string) y `durationMs` (number).
- **Comportamiento:** Si `show` es true, muestra el mensaje; el componente usa un `useEffect` interno que, cuando `show` pasa a true, programa un timeout para notificar que debe ocultarse (vía callback `onDismiss` o controlando la duración en el padre). Para mantener la lógica de cleanup en un solo sitio, el padre puede seguir usando un estado `savedIndicator` y el efecto de guardado que hace `setSavedIndicator(true)` y un `setTimeout(() => setSavedIndicator(false), 2000)` con cleanup; el componente solo se encarga de la presentación.

**Ejemplo de uso en App:**

```jsx
// En App: estado y efecto como en 3.2, más:
const [savedIndicator, setSavedIndicator] = useState(false);
useEffect(() => {
	try {
		localStorage.setItem('tasks', JSON.stringify(tasks));
		setSavedIndicator(true);
		const timer = setTimeout(() => setSavedIndicator(false), 2000);
		return () => clearTimeout(timer);
	} catch (e) {
		console.error(e);
	}
}, [tasks]);

// En el JSX:
<SavedIndicator show={savedIndicator} message="✅ Cambios guardados automáticamente" />;
```

**Conceptos:**

- **Componente presentacional:** Solo muestra UI; la lógica (cuándo mostrar/ocultar) puede vivir en el padre o en el propio componente con un callback `onDismiss`.
- **Cleanup:** El timer debe limpiarse en el efecto del padre (o dentro del componente si el timeout vive ahí).

#### Paso 3.4: Componente botón "Resetear aplicación" (opcional)

**Componentizar:** Crear un componente para el botón que borra localStorage y resetea las tareas, con confirmación.

- **Archivo:** `src/components/ResetAppButton.jsx`
- **Props:** `onReset` (función sin argumentos que el padre usa para borrar `localStorage` y llamar a `setTasks([])`), opcionalmente `confirmMessage` (string) y `label` (string).
- **Comportamiento:** Al hacer clic, muestra `window.confirm(confirmMessage)`; si el usuario acepta, llama a `onReset()`. El padre es responsable de limpiar localStorage y actualizar el estado.

**Ejemplo de uso en App:**

```jsx
const handleResetApp = () => {
	if (window.confirm('⚠️ ¿Seguro que quieres eliminar todas las tareas? Esta acción no se puede deshacer.')) {
		localStorage.removeItem('tasks');
		setTasks([]);
	}
};

// En el JSX:
<ResetAppButton onReset={handleResetApp} />;
```

**Ventajas de componentizar:**

- **SavedIndicator:** Reutilizable en otras pantallas que persistan datos; pruebas más sencillas.
- **ResetAppButton:** Encapsula el texto del botón y la confirmación; el padre solo proporciona la lógica de reset.

### ✅ Criterios de Aceptación

- [ ] Las tareas se cargan desde localStorage al iniciar la aplicación
- [ ] Cada cambio en las tareas se guarda automáticamente en localStorage
- [ ] Al recargar la página (F5), las tareas persisten
- [ ] Si no hay datos guardados, se muestran las tareas por defecto
- [ ] No hay errores en consola relacionados con localStorage
- [ ] (Opcional) Componente `SavedIndicator`: se muestra indicador visual de guardado automático
- [ ] (Opcional) Componente `ResetAppButton`: botón de reset con confirmación

### 🧪 Casos de Prueba

1. **Primera carga:** Sin datos previos, deben aparecer las 2 tareas por defecto
2. **Añadir tarea y recargar:** La nueva tarea debe seguir ahí
3. **Completar tarea y recargar:** El estado "completada" debe persistir
4. **Limpiar completadas y recargar:** Las tareas eliminadas no deben volver
5. **Cambiar prioridad y recargar:** La prioridad debe mantenerse
6. **Abrir en otra pestaña:** Las tareas deben ser las mismas (mismo origen)

### 🔍 Debugging localStorage

Abrir las DevTools del navegador:

1. **Chrome/Edge:** F12 → Application → Local Storage → `http://localhost:5173`
2. **Firefox:** F12 → Storage → Local Storage → `http://localhost:5173`

Allí puedes:

- Ver el contenido de `tasks` (string JSON)
- Editar manualmente los datos
- Eliminar la clave para probar el estado inicial

### ⚠️ Limitaciones y Consideraciones

| Aspecto                           | Detalle                                           |
| --------------------------------- | ------------------------------------------------- |
| **Límite de almacenamiento**      | ~5-10 MB (varía por navegador)                    |
| **Sincronización entre pestañas** | No automática (usar `storage` event si necesario) |
| **Seguridad**                     | NO guardar datos sensibles (sin cifrado)          |
| **Tipos de datos**                | Solo strings (usar JSON.stringify/parse)          |
| **Modo incógnito**                | Se borra al cerrar la ventana                     |

### 📝 Prompt para Implementación

```
Implementa la Fase 3 del plan de ejercicios React ubicado en:
/Users/ruvebal/projects/ruvebal/scholar/udit/courses-repos/react-template/docs/plan-ejercicios-react.md

TAREA: Añadir persistencia con localStorage para que las tareas sobrevivan al refresco de página.

REQUISITOS:
1. Importar useEffect en App.jsx
2. Crear función getInitialTasks() para cargar tareas de localStorage al iniciar
3. Implementar useEffect que guarde tasks en localStorage cada vez que cambien
4. Manejar errores con try-catch
5. (OPCIONAL) Componentizar: crear SavedIndicator.jsx para el indicador visual de guardado
6. (OPCIONAL) Componentizar: crear ResetAppButton.jsx para el botón de reset con confirmación

FOCO PEDAGÓGICO:
- Explicar qué es useEffect y por qué se necesita
- Demostrar el concepto de "efecto secundario"
- Comentar el array de dependencias [tasks]
- Mostrar cómo funciona localStorage con JSON.stringify/parse
- Explicar la función de cleanup si se implementa el indicador temporal

CASOS DE PRUEBA A VALIDAR:
1. Añadir tarea → recargar → verificar que persiste
2. Completar tarea → recargar → verificar que sigue completada
3. Eliminar tarea → recargar → verificar que no vuelve
4. Inspeccionar localStorage en DevTools

ENTREGABLE:
- Código implementado en App.jsx con useEffect
- Reporte de implementación con explicación de useEffect
- Evidencia de que las tareas persisten (screenshots de antes/después del refresh)
- Captura de DevTools mostrando el contenido de localStorage
```

---

## 🪝 Bloque Hooks: Lección asociada

Las **Fases 4–7** extienden la lista de tareas para practicar el contenido de la lección **Dominio de hooks**.

| Recurso                       | En línea                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Lección: Dominio de hooks** | [lessons/es/react/react-hooks/](https://ruvebal.github.io/web-atelier-udit/lessons/es/react/react-hooks/)     |
| **Plan (este doc)**           | [plan-ejercicios-react.md](https://github.com/ruvebal/react-template/blob/main/docs/plan-ejercicios-react.md) |

### Objetivos del bloque (alineados con la lección)

- Extraer lógica reutilizable en **custom hooks** (`useLocalStorage`, `useDebounce`, `useToggle`).
- Usar **useRef** para acceso al DOM (focus del input) y valores que no disparan re-render.
- Aplicar **useEffect** con **cleanup** (timers, suscripciones).
- Introducir **useMemo** y **useCallback** con criterio (evitar optimización prematura).
- Evitar pitfalls: closures obsoletos, bucles infinitos, dependencias incorrectas.

### Orden recomendado

1. Leer la lección (al menos secciones de custom hooks, useRef, useMemo/useCallback).
2. Implementar Fase 4 → 5 → 6 → 7 sobre la app ya construida en Fases 1–3.

---

## 🗃️ Fase 4: Custom hook useLocalStorage

### 🎓 Objetivos de aprendizaje

- Extraer la persistencia en localStorage a un **custom hook** reutilizable.
- Reutilizar el mismo patrón en otras partes de la app (p. ej. tema, preferencias).
- Practicar **lazy initialization** y setter que persiste.

### 🧠 Conceptos (lección asociada)

- Custom hooks: reglas (solo en top-level y en componentes/hooks), convención `use*`.
- Encapsular estado + efecto en un hook que devuelve `[value, setValue]`.

### 📋 Pasos de implementación

#### Paso 4.1: Crear `src/hooks/useLocalStorage.js`

```jsx
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * Hook que sincroniza un valor con localStorage.
 * @param {string} key - Clave en localStorage
 * @param {T} initialValue - Valor si no hay nada guardado
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
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.error(`Error setting localStorage key "${key}":`, error);
		}
	};

	return [storedValue, setValue];
}
```

#### Paso 4.2: Refactorizar `App.jsx`

Sustituir el `useState` + `useEffect` de tareas por:

```jsx
const [tasks, setTasks] = useLocalStorage('tasks', [
	{ id: 1, text: 'Aprender fundamentos de React', completed: false, priority: 'alta' },
	{ id: 2, text: 'Construir una app de tareas', completed: false, priority: 'media' },
]);
```

Eliminar `getInitialTasks` y el `useEffect` que guardaba en localStorage.

### ✅ Criterios de aceptación

- [ ] Existe `src/hooks/useLocalStorage.js` y se usa en `App.jsx`.
- [ ] Las tareas siguen persistiendo al recargar.
- [ ] No queda lógica duplicada de localStorage en `App.jsx`.

### 📝 Prompt para implementación

```
Implementa la Fase 4 del plan ubicado en:
/Users/ruvebal/projects/ruvebal/scholar/udit/courses-repos/react-template/docs/plan-ejercicios-react.md

TAREA: Extraer la persistencia de tareas a un custom hook useLocalStorage.

REQUISITOS:
1. Crear src/hooks/useLocalStorage.js con la firma [value, setValue]
2. Soporte inicialización perezosa y setter funcional
3. Refactorizar App.jsx para usar useLocalStorage('tasks', initialTasks)
4. Eliminar getInitialTasks y el useEffect de sincronización con localStorage

LECCIÓN ASOCIADA:
/Users/ruvebal/projects/ruvebal/scholar/udit/web-atelier-udit/web-foundations/docs/lessons/es/react/react-hooks/index.md

ENTREGABLE:
- Código del hook y cambios en App.jsx
- Reporte indicando la ruta del plan y que la persistencia sigue funcionando
```

---

## 🔍 Fase 5: useDebounce y búsqueda de tareas

### 🎓 Objetivos de aprendizaje

- Implementar un custom hook **useDebounce** para retrasar actualizaciones (búsqueda).
- Practicar **useEffect** con **cleanup** (clearTimeout).
- Filtrar la lista de tareas por texto sin disparar un filtrado en cada tecla.

### ¿Qué es “debounce” y por qué useDebounce?

La palabra viene de la electrónica: un interruptor mecánico **rebota** (_bounce_) al pulsarlo — hace y deshace contacto varias veces en milisegundos. **Debounce** es el proceso de ignorar esos rebotes y considerar solo el estado final, estable. En programación se usa la misma idea: muchos eventos seguidos (teclas, clics) se tratan como “ruido”; esperamos a que **se calme** y entonces actuamos una sola vez.

Sin debounce, el valor del input de búsqueda cambia **en cada tecla**. Si filtraras la lista con ese valor, el filtrado se ejecutaría decenas de veces por palabra (una por "r", otra por "re", otra por "rea"…). Es innecesario y puede notarse como lag.

**En la práctica:** _“Espera a que el usuario deje de escribir durante X ms; solo entonces usa el valor actual.”_ Así, al escribir "react", el valor con el que filtras no se actualiza en cada letra, sino **una vez** unos 300 ms después de dejar de teclear. El filtrado (o una petición al servidor) corre muchas menos veces.

En resumen: **useDebounce** recibe un valor que cambia a menudo (p. ej. el texto del input) y devuelve una versión que solo se actualiza cuando ese valor lleva un rato estable — el patrón adecuado para búsquedas y filtros en tiempo real.

### 🧠 Conceptos (lección asociada)

- useDebounce: valor que se actualiza solo tras `delay` ms sin cambios.
- Cleanup: devolver una función desde useEffect que cancele el timer.

### 📋 Pasos de implementación

#### Paso 5.1: Crear `src/hooks/useDebounce.js`

```jsx
// hooks/useDebounce.js
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
}
```

#### Paso 5.2: Añadir búsqueda en la UI

- En `App.jsx`: estado `searchTerm` y `debouncedSearch = useDebounce(searchTerm, 300)`.
- Calcular `filteredTasks` (o `visibleTasks`) con el filtro por `debouncedSearch` y pasar esa lista a `<TaskList>` (no `tasks`).
- **Componente de búsqueda:** Crear `SearchTasksInput` en `src/components/SearchTasksInput.jsx`: input controlado que recibe `value` y `onChange` (el padre pasa `searchTerm` y `setSearchTerm`). Incluir placeholder "Buscar tareas..." y `aria-label` para accesibilidad.
- En `App.jsx`: renderizar `<SearchTasksInput value={searchTerm} onChange={setSearchTerm} />` **solo cuando existan más de una tarea** (`tasks.length > 1`). Con cero o una tarea, filtrar no tiene sentido.
- Nota pedagógica: igual que con "Ocultar completadas", la barra de búsqueda solo tiene sentido cuando hay varias tareas que filtrar; con una sola (o ninguna) no se muestra para evitar ruido visual y comunicar que la UI reacciona a los datos.

### ✅ Criterios de aceptación

- [ ] Existe `useDebounce` y se usa en la búsqueda.
- [ ] El filtrado no se ejecuta en cada tecla sino tras dejar de escribir ~300 ms.
- [ ] El efecto hace cleanup con `clearTimeout`.

### 📝 Prompt para implementación

```
Implementa la Fase 5 del plan ubicado en:
/Users/ruvebal/projects/ruvebal/scholar/udit/courses-repos/react-template/docs/plan-ejercicios-react.md

TAREA: Añadir búsqueda de tareas con useDebounce.

REQUISITOS:
1. Crear src/hooks/useDebounce.js con cleanup (clearTimeout en el return del useEffect)
2. En App.jsx: estado searchTerm, debouncedSearch = useDebounce(searchTerm, 300)
3. Filtrar tareas por debouncedSearch y pasar lista filtrada a TaskList
4. Crear componente SearchTasksInput (value, onChange) y usarlo en App **solo si hay más de una tarea** (tasks.length > 1); con 0 o 1 no hace falta.

LECCIÓN ASOCIADA:
/Users/ruvebal/projects/ruvebal/scholar/udit/web-atelier-udit/web-foundations/docs/lessons/es/react/react-hooks/index.md

ENTREGABLE:
- Código del hook useDebounce, componente SearchTasksInput y cambios en App.jsx
- Reporte indicando la ruta del plan y evidencia del cleanup en useEffect
```

---

## 🎚️ Fase 6: useRef y useToggle

### 🎓 Objetivos de aprendizaje

- Usar **useRef** para referenciar el input de añadir tarea y darle **focus** tras añadir.
- Implementar **useToggle** (o equivalente) para alternar "mostrar/ocultar tareas completadas".
- Evitar re-renders innecesarios con refs (la ref no dispara render al cambiar).

### 🧠 Conceptos (lección asociada)

- useRef: referencia mutable que persiste entre renders; acceso al DOM con `ref={inputRef}`.
- Custom hook useToggle: `[on, toggle, setTrue, setFalse]` para booleanos reutilizables.

### 📋 Pasos de implementación

#### Paso 6.1: useRef para focus

- Crear `inputRef = useRef(null)` en el componente que contiene el input de nueva tarea (p. ej. `AddTaskInput` o `App`).
- Tras llamar a `onAdd(...)`, ejecutar `inputRef.current?.focus()`.
- Pasar `ref={inputRef}` al `<input>` de la tarea.

#### Paso 6.2: useToggle para "Ocultar completadas"

- Crear `src/hooks/useToggle.js`: estado booleano + funciones `toggle`, `setTrue`, `setFalse`.
- En `App.jsx`: `const [hideCompleted, toggleHideCompleted] = useToggle(false)`.
- Filtrar (o ocultar visualmente) las tareas completadas cuando `hideCompleted === true`.
- Nota pedagógica: este patrón introduce la idea de que **la UI debe reaccionar a los datos**. Si no hay tareas completadas, el toggle desaparece porque no tiene efecto; cuando aparecen completadas, la opción de ocultarlas se hace visible.

#### Paso 6.3: Componente HideCompletedCheckbox

- Crear `src/components/HideCompletedCheckbox.jsx`: componente presentacional que recibe `checked`, `onChange` y opcionalmente `label`.
- Renderiza un checkbox con su etiqueta ("Ocultar tareas completadas"); el padre controla el estado con useToggle y pasa `checked={hideCompleted}` y `onChange={toggleHideCompleted}`.
- Mostrarlo **solo cuando exista al menos una tarea completada** (`hasCompletedTasks && <HideCompletedCheckbox ... />`), para que la UI no ofrezca una acción sin efecto.

### ✅ Criterios de aceptación

- [ ] Tras añadir una tarea, el foco vuelve al input de texto.
- [ ] Existe useToggle y controla la visibilidad de tareas completadas.
- [ ] Existe el componente HideCompletedCheckbox y se usa en App con checked/onChange.
- [ ] La ref no causa re-renders al usarla solo para focus.

### 📝 Prompt para implementación

```
Implementa la Fase 6 del plan ubicado en:
/Users/ruvebal/projects/ruvebal/scholar/udit/courses-repos/react-template/docs/plan-ejercicios-react.md

TAREA: useRef para focus en el input de nueva tarea y useToggle para ocultar completadas.

REQUISITOS:
1. useRef: después de añadir tarea, hacer focus en el input (inputRef.current?.focus())
2. Crear useToggle(initial) → [value, toggle, setTrue, setFalse]
3. Crear componente HideCompletedCheckbox (checked, onChange, label opcional) y usarlo en App
4. Aplicar filtro (no eliminar del estado) cuando hideCompleted es true

LECCIÓN ASOCIADA:
/Users/ruvebal/projects/ruvebal/scholar/udit/web-atelier-udit/web-foundations/docs/lessons/es/react/react-hooks/index.md

ENTREGABLE:
- Código de useToggle, HideCompletedCheckbox.jsx, cambios en App.jsx y AddTaskInput (ref)
- Reporte indicando la ruta del plan
```

---

## ⚡ Fase 7: useMemo y useCallback (optimización)

### 🎓 Objetivos de aprendizaje

- Saber **cuándo** tiene sentido memoizar (listas filtradas/ordenadas costosas o callbacks en listas grandes).
- Implementar **useMemo** para la lista filtrada/ordenada de tareas.
- Implementar **useCallback** para handlers pasados a hijos (p. ej. `onToggle`, `onRemove`) si se observan re-renders innecesarios.
- **No** abusar: documentar por qué se añade cada memoización.

### 🧠 Conceptos (lección asociada)

- useMemo: recalcular solo cuando cambian dependencias; evitar cálculos pesados en cada render.
- useCallback: estabilizar la referencia de una función para no romper memoización de hijos (React.memo).
- Optimización prematura: medir antes; memoizar cuando hay problema real de rendimiento.

### 📋 Pasos de implementación

#### Paso 7.1: useMemo para lista visible

**Beneficio arquitectónico de useMemo frente a cálculo en cada render**

- **Sin useMemo:** En cada render de `App` (p. ej. al cambiar `savedIndicator`, `searchTerm`, etc.) se vuelve a ejecutar el filtrado y orden. El resultado es correcto pero se recalcula siempre.
- **Con useMemo:** La lista derivada solo se recalcula cuando cambian `tasks`, `hideCompleted` o `debouncedSearch`. Si el padre re-renderiza por otro motivo (otro estado), React reutiliza el valor memoizado y no vuelve a ejecutar el callback. Además, la **referencia** del array es estable mientras las dependencias no cambien, lo que ayuda si `TaskList` o sus hijos usaran `React.memo`.

**¿Es lo mismo useCallback?** No. `useMemo` memoiza un **valor** (aquí, el array de tareas visibles). `useCallback` memoiza una **función** (p. ej. `onToggle`, `onRemove`). Se usa useCallback cuando pasas callbacks a hijos memoizados: si el callback cambiara en cada render, el hijo se re-renderizaría igual. En esta app, si los ítems no están envueltos en `React.memo`, useCallback no aporta beneficio.

**¿Tiene sentido en esta app?** Con pocas tareas, filtrar y ordenar es barato; la ganancia de useMemo aquí es **pequeña**. Se introduce como patrón pedagógico: en listas largas o cálculos costosos, useMemo sí evita trabajo innecesario. Documentar en código por qué se usa ("lista derivada; evita recalcular en cada render cuando otras dependencias no han cambiado") evita optimización prematura sin contexto.

- Si ya tienes filtros (búsqueda, ocultar completadas) y/o orden por prioridad, calcular la lista final con `useMemo`:

```jsx
const priorityOrder = { alta: 0, media: 1, baja: 2 };

const visibleTasks = useMemo(() => {
	let list = tasks;
	if (hideCompleted) list = list.filter((t) => !t.completed);
	if (debouncedSearch.trim()) {
		const q = debouncedSearch.toLowerCase();
		list = list.filter((t) => t.text.toLowerCase().includes(q));
	}
	return [...list].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}, [tasks, hideCompleted, debouncedSearch]);
```

- Pasar `visibleTasks` a `<TaskList>`.

#### Paso 7.2: useCallback (pedagógico: enseñar el par React.memo + useCallback)

Vale la pena enseñar **useCallback** junto a **React.memo** para que el alumnado entienda el patrón completo: un hijo memoizado solo evita re-renders si las props no cambian; si el padre pasa funciones creadas en cada render (`onToggle`, `onRemove`), esas props son "nuevas" cada vez y el hijo se re-renderiza igual. useCallback devuelve la **misma referencia** de función mientras las dependencias no cambien.

**Pasos recomendados:**

1. **Envolver `TaskItem` en `React.memo`** (export default memo(TaskItem)). Sin esto, useCallback no tiene efecto visible: el hijo siempre re-renderiza.
2. **Estabilizar los handlers en App con useCallback.** Para que la referencia sea estable, usar **actualizador funcional** en setState: `setTasks(prev => ...)` en lugar de `setTasks(tasks.filter(...))`. Así las dependencias de useCallback pueden ser `[]` y la función no cambia entre renders.
3. **Comentar en código** por qué se usa: "useCallback aquí porque TaskItem está memoizado; referencia estable para no forzar re-render de todos los ítems cuando App actualiza por otro estado (p. ej. savedIndicator, searchTerm)".

**Importante:** useCallback con `[]` no evita que **App** re-renderice (App sigue re-renderizándose cuando cambia tasks, searchTerm, savedIndicator, etc.). Lo que hace es devolver la **misma referencia** de función en cada render de App, de modo que los hijos memoizados (TaskItem) no vean un cambio en la prop y no se re-rendericen innecesariamente.

**Resumen didáctico:** React.memo + useCallback (con actualizador funcional) = referencias estables de props → solo re-renderizan los ítems cuya tarea cambió. En esta app con pocas tareas el beneficio es pequeño; el objetivo es aprender el patrón para listas largas o componentes costosos.

### ✅ Criterios de aceptación

- [ ] La lista visible se calcula con useMemo y dependencias correctas.
- [ ] TaskItem envuelto en React.memo; onToggle y onRemove definidos con useCallback y actualizador funcional en setTasks.
- [ ] Comentarios en código que justifican React.memo y useCallback (evitar optimización prematura sin contexto).

### 📝 Prompt para implementación

```
Implementa la Fase 7 del plan ubicado en:
/Users/ruvebal/projects/ruvebal/scholar/udit/courses-repos/react-template/docs/plan-ejercicios-react.md

TAREA: Añadir useMemo para la lista visible y useCallback para handlers (pedagógico: par React.memo + useCallback).

REQUISITOS:
1. useMemo para visibleTasks (filtros + orden) con dependencias [tasks, hideCompleted, debouncedSearch]
2. React.memo en TaskItem; useCallback para removeTask y toggleTask en App usando actualizador funcional (setTasks(prev => ...)) para dependencias [] y referencia estable
3. Comentar en código por qué se usa cada memoización (useMemo, useCallback, React.memo)

LECCIÓN ASOCIADA:
/Users/ruvebal/projects/ruvebal/scholar/udit/web-atelier-udit/web-foundations/docs/lessons/es/react/react-hooks/index.md

ENTREGABLE:
- Cambios en App.jsx (useMemo, useCallback) y TaskItem.jsx (React.memo)
- Reporte indicando la ruta del plan y la justificación de cada hook de optimización
```

---

## 📊 Resumen de Conceptos por Fase

### Tabla Comparativa de Complejidad

| Aspecto              | F1                   | F2                 | F3                      | F4          | F5                   | F6                | F7                   |
| -------------------- | -------------------- | ------------------ | ----------------------- | ----------- | -------------------- | ----------------- | -------------------- |
| **Dificultad**       | ⭐⭐                 | ⭐⭐⭐             | ⭐⭐⭐⭐                | ⭐⭐⭐      | ⭐⭐⭐               | ⭐⭐⭐            | ⭐⭐⭐⭐             |
| **Conceptos nuevos** | Condicional, .filter | Prioridad, estilos | useEffect, localStorage | Custom hook | useDebounce, cleanup | useRef, useToggle | useMemo, useCallback |
| **Tiempo estimado**  | 15-20 min            | 30-40 min          | 25-35 min               | 20-30 min   | 25-35 min            | 25-35 min         | 20-30 min            |

### Progresión Pedagógica

```
Concepto transversal: Virtual DOM (vDOM)
└─ Explica por qué la inmutabilidad es obligatoria en React

Fase 1: Limpiar Completadas
├─ Refuerza: Inmutabilidad (vDOM), .filter(), renderizado condicional
└─ Prepara para: Manipulación avanzada de estado

Fase 2: Sistema de Prioridades
├─ Refuerza: Extensión del modelo, props, estilos dinámicos
└─ Prepara para: Gestión de estructuras de datos complejas

Fase 3: Persistencia localStorage
├─ Introduce: useEffect, sincronización externa, serialización
└─ Fundamento para: Llamadas API, bases de datos, estado global

Bloque Hooks (lección: react-hooks/index.md)
Fase 4: useLocalStorage
├─ Custom hooks: encapsular estado + efecto
└─ Reutilización en toda la app

Fase 5: useDebounce + búsqueda
├─ useEffect con cleanup (clearTimeout)
└─ Patrón debounce para inputs

Fase 6: useRef + useToggle
├─ useRef: DOM (focus) y valores mutables
└─ useToggle: booleano reutilizable

Fase 7: useMemo + useCallback
├─ Optimización con criterio
└─ Evitar optimización prematura
```

---

## 🎓 Recursos Adicionales

### Documentación Oficial React

- [Render and Commit](https://react.dev/learn/render-and-commit) — Ciclo de renderizado y vDOM
- [useState Hook](https://react.dev/reference/react/useState)
- [useEffect Hook](https://react.dev/reference/react/useEffect)
- [useRef Hook](https://react.dev/reference/react/useRef)
- [useMemo Hook](https://react.dev/reference/react/useMemo)
- [useCallback Hook](https://react.dev/reference/react/useCallback)
- [Renderizado Condicional](https://react.dev/learn/conditional-rendering)
- [Renderizado de Listas](https://react.dev/learn/rendering-lists)
- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

### MDN Web Docs

- [localStorage API](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- [JSON.stringify()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [Array.prototype.filter()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

### Tailwind CSS

- [Utility Classes](https://tailwindcss.com/docs/utility-first)
- [Hover, Focus y otros estados](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Animations](https://tailwindcss.com/docs/animation)

### Lección: Dominio de hooks

- **Ruta:** `/Users/ruvebal/projects/ruvebal/scholar/udit/web-atelier-udit/web-foundations/docs/lessons/es/react/react-hooks/index.md`
- Incluye: useFetch, useLocalStorage, useDebounce, useToggle, buenas prácticas, preguntas críticas y metodología atelier.

### Patrones Avanzados (Próximos pasos)

Después de completar las Fases 1–7, puedes explorar:

1. **Context API** para estado global (evitar prop drilling)
2. **useReducer** para lógica de estado compleja
3. **useFetch** (lección hooks) para datos de API
4. **React Query/SWR** para gestión de datos del servidor
5. **Tests de hooks** (renderHook, act) como en la lección

---

## 📈 Evaluación y Autoevaluación

### Checklist de Completitud

Al finalizar las 7 fases, deberías poder responder "Sí" a todas:

**Conocimientos:**

- [ ] ¿Entiendo qué es el Virtual DOM y por qué React lo usa?
- [ ] ¿Entiendo por qué React necesita inmutabilidad? (relación con vDOM)
- [ ] ¿Puedo explicar qué hace `.filter()` y por qué no `.splice()`?
- [ ] ¿Comprendo cómo funcionan las props entre componentes?
- [ ] ¿Sé cuándo usar renderizado condicional?
- [ ] ¿Entiendo el propósito de `useEffect`?
- [ ] ¿Puedo explicar qué es un "efecto secundario"?
- [ ] ¿Sé cómo funciona el array de dependencias de `useEffect`?
- [ ] ¿Puedo crear un custom hook que encapsule estado y efecto?
- [ ] ¿Entiendo cuándo usar useRef (DOM vs valor mutable)?
- [ ] ¿Sé cuándo tiene sentido useMemo/useCallback y cuándo es optimización prematura?
- [ ] ¿Puedo implementar cleanup en useEffect (timers, abort)?

**Habilidades:**

- [ ] ¿Puedo añadir un nuevo campo al modelo de datos sin bugs?
- [ ] ¿Sé implementar estilos dinámicos con Tailwind?
- [ ] ¿Puedo debuggear problemas de estado con React DevTools?
- [ ] ¿Sé inspeccionar localStorage en las DevTools del navegador?
- [ ] ¿Puedo refactorizar lógica a un custom hook y reutilizarla?
- [ ] ¿Sé dar focus a un input con useRef tras una acción?

### Desafíos Adicionales (Para practicar más)

1. **Editar tareas:** Añadir un botón "Editar" que permita cambiar el texto
2. **Categorías:** Agrupar tareas por categorías personalizadas
3. **Fecha límite:** Añadir fechas de vencimiento y resaltar tareas vencidas
4. **Búsqueda:** Implementar un input para filtrar tareas por texto
5. **Arrastrar y soltar:** Reordenar tareas con drag & drop (usar `react-beautiful-dnd`)

---

## 📝 Formato de Reporte de Implementación

Después de implementar cada fase, documenta tu progreso con este formato:

```markdown
# Reporte de Implementación - Fase X

## Información General

- **Fecha:** [DD/MM/YYYY]
- **Tiempo invertido:** [X minutos]
- **Archivos modificados:** [Lista de archivos]

## Resumen de Cambios

[Breve descripción de lo implementado]

## Código Clave

[Snippets de las partes más importantes con explicaciones]

## Decisiones de Diseño

[Explica por qué elegiste cierta implementación sobre otras]

## Desafíos Encontrados

[Problemas que surgieron y cómo los resolviste]

## Aprendizajes Clave

[¿Qué conceptos nuevos dominaste?]

## Evidencia Visual

[Screenshots o GIFs de la funcionalidad]

## Pruebas Realizadas

- [ ] Prueba 1: [Descripción]
- [ ] Prueba 2: [Descripción]

## Próximos Pasos

[¿Qué mejorarías? ¿Qué aprendiste para aplicar en la siguiente fase?]
```

---

## 🚀 Conclusión

Este plan te guía en dos bloques: **Fases 1–3** (fundamentos) y **Fases 4–7** (dominio de hooks), alineado con la lección [Dominio de hooks](/Users/ruvebal/projects/ruvebal/scholar/udit/web-atelier-udit/web-foundations/docs/lessons/es/react/react-hooks/index.md). La lista de tareas crece en funcionalidad y en uso de hooks:

- **Inmutabilidad** y vDOM como base
- **useState** y **useEffect** para estado y efectos
- **Custom hooks** (`useLocalStorage`, `useDebounce`, `useToggle`) para lógica reutilizable
- **useRef** para DOM y valores que no disparan render
- **useMemo** y **useCallback** con criterio, evitando optimización prematura

Al completar las 7 fases, tendrás práctica directa con el contenido de la lección de hooks y una base sólida para estado global, APIs y tests de hooks.

---

**Ruta de referencia del plan:**
`/Users/ruvebal/projects/ruvebal/scholar/udit/courses-repos/react-template/docs/plan-ejercicios-react.md`

**Lección React (fundamentos):**
`/Users/ruvebal/projects/ruvebal/scholar/udit/web-atelier-udit/web-foundations/docs/lessons/es/react`

**Lección Dominio de hooks (Fases 4–7):**
`/Users/ruvebal/projects/ruvebal/scholar/udit/web-atelier-udit/web-foundations/docs/lessons/es/react/react-hooks/index.md`

---

_Última actualización: 2 de febrero de 2026_
