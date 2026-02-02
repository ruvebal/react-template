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
- [Recursos Adicionales](#-recursos-adicionales)

---

## 🎯 Visión General

Este documento describe la implementación de **tres ejercicios progresivos** para una aplicación de gestión de tareas en React. Cada ejercicio introduce nuevos conceptos y patrones fundamentales de React.

### Objetivos de Aprendizaje Globales

1. **Virtual DOM (vDOM)** y su relación con la inmutabilidad
2. **Manipulación avanzada del estado** con `useState`
3. **Efectos secundarios** y ciclo de vida con `useEffect`
4. **Renderizado condicional** y estilos dinámicos
5. **Persistencia de datos** en el navegador
6. **Patrones de inmutabilidad** en JavaScript

### Prerrequisitos

- ✅ Comprensión básica de `useState`
- ✅ Sintaxis de JavaScript ES6+ (arrow functions, destructuring, spread operator)
- ✅ Conocimiento de métodos de arrays (`.map()`, `.filter()`)
- ✅ Tailwind CSS para estilos (ya configurado)

---

## 🧩 Conceptos React Cubiertos

| Concepto                              | Fase 1 | Fase 2 | Fase 3 |
| ------------------------------------- | ------ | ------ | ------ |
| Virtual DOM (vDOM) - Fundamentos      | ✅     | ✅     | ✅     |
| `useState` - Estado básico            | ✅     | ✅     | ✅     |
| Actualización inmutable del estado    | ✅     | ✅     | ✅     |
| Props y comunicación componente-padre | ✅     | ✅     | ✅     |
| Renderizado condicional               | ✅     | ✅     | ✅     |
| Estilos dinámicos con clases CSS      | -      | ✅     | -      |
| `useEffect` - Efectos secundarios     | -      | -      | ✅     |
| Sincronización con APIs externas      | -      | -      | ✅     |
| Serialización JSON                    | -      | -      | ✅     |

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
			{ id: 1, text: 'Aprender fundamentos de React', completed: false, priority: 'alta' },
			{ id: 2, text: 'Construir una app de tareas', completed: false, priority: 'media' },
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

#### Paso 3.3: Añadir feedback visual de guardado (opcional)

Mostrar un indicador temporal cuando se guarden las tareas:

```jsx
import { useState, useEffect } from 'react';

function App() {
	const [tasks, setTasks] = useState(getInitialTasks);
	const [savedIndicator, setSavedIndicator] = useState(false); // 🆕

	// Guardar en localStorage
	useEffect(() => {
		try {
			localStorage.setItem('tasks', JSON.stringify(tasks));

			// 🆕 Mostrar indicador de guardado
			setSavedIndicator(true);

			// 🆕 Ocultar después de 2 segundos
			const timer = setTimeout(() => {
				setSavedIndicator(false);
			}, 2000);

			// 🆕 Cleanup: cancelar timer si el componente se desmonta
			return () => clearTimeout(timer);
		} catch (error) {
			console.error('Error al guardar:', error);
		}
	}, [tasks]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
			<div className="max-w-2xl mx-auto">
				{/* 🆕 Indicador de guardado */}
				{savedIndicator && (
					<div
						className="mb-4 p-2 bg-green-100 border border-green-300 text-green-800
                          rounded-lg text-center text-sm animate-pulse">
						✅ Cambios guardados automáticamente
					</div>
				)}

				{/* ... resto del JSX */}
			</div>
		</div>
	);
}
```

**Conceptos avanzados:**

- **Segundo estado:** Para controlar la visibilidad del mensaje
- **setTimeout:** Para ocultar el mensaje automáticamente
- **Cleanup function:** `return () => clearTimeout(timer)` limpia el timer cuando el componente se desmonta o antes de ejecutar el efecto de nuevo
- **animate-pulse:** Clase de Tailwind para animación

#### Paso 3.4: Añadir botón "Limpiar todo" con confirmación (opcional)

Para pruebas, añadir un botón que borre localStorage:

```jsx
// 🆕 Función para resetear la aplicación
const resetApp = () => {
	if (window.confirm('⚠️ ¿Seguro que quieres eliminar todas las tareas? Esta acción no se puede deshacer.')) {
		localStorage.removeItem('tasks');
		setTasks([]);
	}
};

// En el JSX, añadir al final:
<div className="mt-4 text-center">
	<button onClick={resetApp} className="text-sm text-gray-500 hover:text-red-600 underline">
		🗑️ Resetear aplicación (borrar todo)
	</button>
</div>;
```

### ✅ Criterios de Aceptación

- [ ] Las tareas se cargan desde localStorage al iniciar la aplicación
- [ ] Cada cambio en las tareas se guarda automáticamente en localStorage
- [ ] Al recargar la página (F5), las tareas persisten
- [ ] Si no hay datos guardados, se muestran las tareas por defecto
- [ ] No hay errores en consola relacionados con localStorage
- [ ] (Opcional) Se muestra un indicador visual de guardado automático

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
5. (OPCIONAL) Añadir indicador visual de guardado automático
6. (OPCIONAL) Implementar botón de reset con confirmación

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

## 📊 Resumen de Conceptos por Fase

### Tabla Comparativa de Complejidad

| Aspecto                     | Fase 1                  | Fase 2                               | Fase 3                        |
| --------------------------- | ----------------------- | ------------------------------------ | ----------------------------- |
| **Dificultad**              | ⭐⭐                    | ⭐⭐⭐                               | ⭐⭐⭐⭐                      |
| **Líneas de código nuevas** | ~15                     | ~60                                  | ~30                           |
| **Componentes afectados**   | 1 (App.jsx)             | 3 (App, AddTaskInput, TaskItem)      | 1 (App.jsx)                   |
| **Conceptos nuevos**        | Renderizado condicional | Estilos dinámicos, múltiples estados | useEffect, APIs del navegador |
| **Tiempo estimado**         | 15-20 min               | 30-40 min                            | 25-35 min                     |

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
```

---

## 🎓 Recursos Adicionales

### Documentación Oficial React

- [Render and Commit](https://react.dev/learn/render-and-commit) — Ciclo de renderizado y vDOM
- [useState Hook](https://react.dev/reference/react/useState)
- [useEffect Hook](https://react.dev/reference/react/useEffect)
- [Renderizado Condicional](https://react.dev/learn/conditional-rendering)
- [Renderizado de Listas](https://react.dev/learn/rendering-lists)

### MDN Web Docs

- [localStorage API](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- [JSON.stringify()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [Array.prototype.filter()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

### Tailwind CSS

- [Utility Classes](https://tailwindcss.com/docs/utility-first)
- [Hover, Focus y otros estados](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Animations](https://tailwindcss.com/docs/animation)

### Patrones Avanzados (Próximos pasos)

Después de completar estas 3 fases, puedes explorar:

1. **Context API** para estado global (evitar prop drilling)
2. **useReducer** para lógica de estado compleja
3. **Custom Hooks** para reutilizar lógica (ej: `useLocalStorage`)
4. **React Query/SWR** para gestión de datos del servidor
5. **Optimización de rendimiento** con `useMemo` y `useCallback`

---

## 📈 Evaluación y Autoevaluación

### Checklist de Completitud

Al finalizar las 3 fases, deberías poder responder "Sí" a todas:

**Conocimientos:**

- [ ] ¿Entiendo qué es el Virtual DOM y por qué React lo usa?
- [ ] ¿Entiendo por qué React necesita inmutabilidad? (relación con vDOM)
- [ ] ¿Puedo explicar qué hace `.filter()` y por qué no `.splice()`?
- [ ] ¿Comprendo cómo funcionan las props entre componentes?
- [ ] ¿Sé cuándo usar renderizado condicional?
- [ ] ¿Entiendo el propósito de `useEffect`?
- [ ] ¿Puedo explicar qué es un "efecto secundario"?
- [ ] ¿Sé cómo funciona el array de dependencias de `useEffect`?

**Habilidades:**

- [ ] ¿Puedo añadir un nuevo campo al modelo de datos sin bugs?
- [ ] ¿Sé implementar estilos dinámicos con Tailwind?
- [ ] ¿Puedo debuggear problemas de estado con React DevTools?
- [ ] ¿Sé inspeccionar localStorage en las DevTools del navegador?

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

Este plan de ejercicios te guía desde conceptos básicos de manipulación de estado hasta técnicas avanzadas de sincronización con APIs externas. Cada fase construye sobre la anterior, reforzando los fundamentos de React:

- **Inmutabilidad** como principio fundamental
- **Componentes** como unidades reutilizables
- **Hooks** (`useState`, `useEffect`) para gestionar estado y efectos
- **Interacción con el navegador** mediante APIs nativas

Al completar estos ejercicios, tendrás una base sólida para construir aplicaciones React más complejas.

---

**Ruta de referencia del plan:**
`/Users/ruvebal/projects/ruvebal/scholar/udit/courses-repos/react-template/docs/plan-ejercicios-react.md`

**Proyecto relacionado:**
`/Users/ruvebal/projects/ruvebal/scholar/udit/web-atelier-udit/web-foundations/docs/lessons/es/react`

---

_Última actualización: 2 de febrero de 2026_
