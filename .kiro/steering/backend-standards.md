---
inclusion: fileMatch
fileMatchPattern: 'src/**/*.js'
---

# Estándares Backend - Código del Servidor

Este steering se aplica automáticamente cuando se editan archivos JavaScript en la carpeta src/ (servidor, generador, data manager).

## Estándares Node.js y Express

### Estructura del Servidor (server.js)
```javascript
// ✅ Estructura requerida
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware requerido
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rutas API
app.post('/api/generate', handleGenerate);
app.get('/api/history', handleHistory);
app.delete('/api/history', handleClearHistory);

// Manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🎭 Generador ejecutándose en http://localhost:${PORT}`);
});
```

### Manejo de Errores
- Implementar middleware de manejo de errores
- Usar try/catch en todas las operaciones asíncronas
- Retornar códigos HTTP apropiados (200, 400, 500)
- Logging de errores para debugging

### Respuestas API Consistentes
```javascript
// ✅ Formato de respuesta exitosa
{
  success: true,
  data: { /* datos relevantes */ },
  message: "Operación completada exitosamente"
}

// ✅ Formato de respuesta de error
{
  success: false,
  error: "Descripción del error",
  message: "Mensaje amigable para el usuario"
}
```

## Estándares del Generador (generator.js)

### Clase CalaveriteGenerator
```javascript
class CalaveriteGenerator {
  constructor() {
    this.templates = TEMPLATES; // Array de plantillas
  }

  // Método principal de generación
  generate(name, profession, trait = null) {
    // Validación de entrada
    // Selección de plantilla
    // Reemplazo de placeholders
    // Retorno de objeto calaverita completo
  }

  // Métodos auxiliares
  selectRandomTemplate() { /* ... */ }
  replaceePlaceholders(pattern, data) { /* ... */ }
  validateInput(name, profession) { /* ... */ }
}
```

### Validación de Plantillas
- Verificar que todas las plantillas tengan estructura requerida
- Validar que placeholders estén correctamente definidos
- Confirmar que `requiresTrait` esté configurado apropiadamente
- Asegurar que IDs de plantillas sean únicos

### Generación de Calaveritas
- Crear IDs únicos para cada calaverita generada
- Incluir timestamp de creación
- Generar metadatos apropiados (wordCount, etc.)
- Validar que el resultado final sea coherente

## Estándares del Data Manager (data-manager.js)

### Clase DataManager
```javascript
class DataManager {
  constructor(dataPath = './data') {
    this.dataPath = dataPath;
    this.calaveriteFile = path.join(dataPath, 'calaveritas.json');
  }

  // Métodos requeridos
  async ensureDataDirectory() { /* ... */ }
  async saveCalaverita(calaverita) { /* ... */ }
  async getHistory() { /* ... */ }
  async clearHistory() { /* ... */ }
}
```

### Persistencia de Datos
- Crear directorio data/ automáticamente si no existe
- Manejar archivos JSON con encoding UTF-8
- Implementar backup automático antes de modificaciones
- Validar integridad de datos al leer/escribir

### Manejo de Archivos
- Usar operaciones asíncronas (fs.promises)
- Implementar manejo de errores específicos para I/O
- Crear archivos con permisos apropiados
- Mantener compatibilidad con datos existentes

## Validaciones de Código

### Sintaxis y Estilo
- Usar `const` por defecto, `let` cuando sea necesario
- Implementar destructuring cuando mejore legibilidad
- Usar template literals para strings complejos
- Mantener funciones pequeñas y con responsabilidad única

### Manejo de Errores
```javascript
// ✅ Patrón correcto para manejo de errores
async function operacionAsincrona() {
  try {
    const resultado = await operacionRiesgosa();
    return { success: true, data: resultado };
  } catch (error) {
    console.error('Error en operación:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Error procesando solicitud'
    };
  }
}
```

### Logging y Debugging
- Usar console.log para información de desarrollo
- Implementar console.error para errores
- Incluir timestamps en logs importantes
- Evitar logging excesivo en producción

## Validaciones Específicas por Archivo

### Para server.js
- Verificar que middleware esté configurado correctamente
- Confirmar que rutas API estén implementadas
- Validar manejo de errores global
- Asegurar que puerto esté configurado apropiadamente

### Para generator.js
- Verificar que clase CalaveriteGenerator esté completa
- Confirmar que plantillas tengan estructura válida
- Validar métodos de generación y validación
- Asegurar que IDs sean únicos y consistentes

### Para data-manager.js
- Verificar que clase DataManager esté implementada
- Confirmar operaciones de archivo asíncronas
- Validar manejo de errores de I/O
- Asegurar que directorio data/ se cree automáticamente

## Dependencias y Configuración

### Package.json Requerido
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js"
  }
}
```

### Variables de Entorno
- PORT: Puerto del servidor (default: 8080)
- NODE_ENV: Entorno de ejecución (development/production)
- DATA_PATH: Ruta para persistencia de datos (default: ./data)

## Aplicación Automática

Estas validaciones se ejecutan cuando:
- Se modifican archivos en src/
- Se ejecutan tests unitarios
- Se inicia el servidor
- Se hace commit de cambios backend