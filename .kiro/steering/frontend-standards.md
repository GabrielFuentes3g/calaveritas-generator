---
inclusion: fileMatch
fileMatchPattern: 'public/**/*'
---

# Estándares Frontend - Archivos Públicos

Este steering se aplica automáticamente cuando se editan archivos en la carpeta public/ (HTML, CSS, JavaScript del frontend).

## Estándares HTML (index.html)

### Estructura Semántica
- Usar elementos semánticos: `<header>`, `<main>`, `<section>`, `<form>`
- Incluir `<meta charset="UTF-8">` y `<meta name="viewport">`
- Usar `<label>` asociados con inputs mediante `for` e `id`
- Implementar estructura accesible con roles ARIA cuando sea necesario

### Accesibilidad
- Todos los inputs deben tener labels descriptivos
- Usar `required` en campos obligatorios
- Incluir `placeholder` con ejemplos apropiados
- Asegurar contraste de colores suficiente
- Permitir navegación completa por teclado

### Tema Día de Muertos
- Incluir emojis temáticos: 🎭, 💀, 📜, ✨, 🗑️
- Usar vocabulario en español mexicano
- Mantener tono festivo y celebratorio
- Referencias culturales apropiadas y respetuosas

## Estándares CSS (styles.css)

### Diseño Responsivo
- Usar CSS Grid para layout principal
- Implementar Flexbox para componentes
- Mobile-first approach con media queries
- Breakpoints: 768px (tablet), 1024px (desktop)

### Colores Temáticos
```css
:root {
  --primary-purple: #6b46c1;
  --primary-green: #059669;
  --accent-orange: #ff6b35;
  --text-white: #ffffff;
  --background-dark: #1f2937;
  --card-background: rgba(255, 255, 255, 0.1);
}
```

### Animaciones y Transiciones
- Usar `transition` suaves (0.3s ease)
- Implementar hover effects en botones
- Animaciones de carga para feedback visual
- Scroll suave con `scroll-behavior: smooth`

### Componentes Requeridos
- Formulario con estilos consistentes
- Tarjetas para historial con hover effects
- Botones con estados: normal, hover, disabled, loading
- Contenedores scrolleables con altura máxima

## Estándares JavaScript Frontend (frontend.js)

### Estructura de Código
- Usar clase principal `CalaveriteApp` para organización
- Implementar métodos específicos: `init()`, `handleSubmit()`, `loadHistory()`
- Usar async/await para operaciones asíncronas
- Manejo de errores con try/catch

### Comunicación con API
```javascript
// ✅ Patrón correcto para llamadas API
async function generateCalaverita(formData) {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generando calaverita:', error);
    throw error;
  }
}
```

### Validación Frontend
- Validar campos requeridos antes de envío
- Mostrar mensajes de error específicos
- Implementar feedback visual inmediato
- Sanitizar entrada del usuario

### Interactividad Requerida
- Estados de carga en botones
- Feedback visual para acciones del usuario
- Scroll automático a resultados
- Confirmaciones para acciones destructivas (limpiar historial)

### Manejo del DOM
- Usar `querySelector` y `querySelectorAll`
- Implementar event listeners apropiados
- Actualizar contenido dinámicamente
- Mantener referencias a elementos frecuentemente usados

## Validaciones Específicas por Archivo

### Para index.html
- Verificar que todos los IDs sean únicos
- Confirmar que labels estén asociados con inputs
- Validar estructura semántica completa
- Asegurar meta tags apropiados

### Para styles.css
- Verificar que variables CSS estén definidas
- Confirmar media queries para responsividad
- Validar que colores tengan contraste suficiente
- Asegurar que animaciones sean suaves

### Para frontend.js
- Verificar que clase principal esté implementada
- Confirmar manejo de errores en llamadas API
- Validar que eventos estén correctamente vinculados
- Asegurar que feedback visual funcione

## Aplicación Automática

Estas validaciones se ejecutan cuando:
- Se modifican archivos en public/
- Se ejecutan tests de interfaz
- Se hace build del proyecto
- Se valida accesibilidad y responsividad