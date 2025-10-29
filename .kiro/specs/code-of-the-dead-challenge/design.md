# Design Document - Code of the Dead Challenge

## Overview

El Code of the Dead Challenge requiere una aplicación web progresiva que demuestre competencias en tres niveles. El diseño se estructura para permitir desarrollo incremental, donde cada nivel construye sobre el anterior, culminando en una demostración completa del ecosistema Kiro.

## Architecture

### Nivel Ofrenda (Básico) - Arquitectura Fundacional
```
Frontend (public/)     Backend (src/)        Data
├── index.html    ←→   ├── server.js    ←→   ├── data/
├── styles.css         ├── generator.js      │   └── calaveritas.json
└── frontend.js        └── data-manager.js   └── package.json
```

### Nivel Catrina (Avanzado) - Arquitectura Extendida
```
Frontend Enhanced      Backend Enhanced      Persistence Enhanced
├── index.html        ├── server.js         ├── data/
├── styles.css        ├── generator.js      │   ├── calaveritas.json
├── frontend.js       ├── data-manager.js   │   ├── templates.json
└── components/       ├── api/              │   └── user-prefs.json
    ├── history.js    │   ├── routes.js     └── backup/
    └── templates.js  │   └── middleware.js     └── auto-backup.json
```

### Nivel Mictlán (Bonus) - Arquitectura Completa con Kiro Stack
```
Kiro Integration       Application Core      Data & Config
├── .kiro/            ├── src/              ├── data/
│   ├── settings/     ├── public/           └── config/
│   │   └── mcp.json  ├── tests/                ├── env.json
│   ├── steering/     └── docs/                 └── deployment.json
│   │   └── rules.md  
│   └── hooks/        
│       └── auto-test.js
```

## Components and Interfaces

### 1. Nivel Ofrenda - Componentes Básicos

#### Generator Core
- **CalaveriteGenerator**: Clase principal para generar calaveritas
- **Template System**: Mínimo 3 plantillas predefinidas
- **Data Manager**: Persistencia básica en JSON local

#### Web Interface
- **Responsive Layout**: CSS Grid/Flexbox para adaptabilidad
- **Form Handler**: Validación y envío de datos
- **Result Display**: Presentación de calaveritas generadas

#### API Endpoints
```javascript
POST /api/generate     // Generar nueva calaverita
GET  /api/history      // Obtener historial básico
```

### 2. Nivel Catrina - Componentes Avanzados

#### Enhanced Generator
- **Template Selector**: 5+ plantillas con características únicas
- **Advanced Validation**: Validación de campos según template
- **Batch Operations**: Generación múltiple y operaciones en lote

#### Interactive UI
- **History Viewer**: Vista previa y navegación de historial
- **Template Preview**: Muestra de plantillas antes de seleccionar
- **Real-time Feedback**: Indicadores de estado y progreso
- **Export Features**: Descarga de calaveritas individuales o en lote

#### Enhanced Persistence
- **Structured Storage**: Organización mejorada de datos
- **Search & Filter**: Búsqueda en historial por criterios
- **Data Backup**: Respaldo automático de datos

#### Extended API
```javascript
GET    /api/templates           // Obtener plantillas disponibles
POST   /api/generate/:template  // Generar con template específico
GET    /api/history/search      // Búsqueda en historial
DELETE /api/history/:id         // Eliminar calaverita específica
POST   /api/export              // Exportar datos
```

### 3. Nivel Mictlán - Integración Kiro Stack

#### MCP Integration
- **MCP Server Configuration**: Configuración de al menos un servidor MCP
- **Tool Integration**: Uso de herramientas MCP en el flujo de desarrollo
- **Context Enhancement**: Mejora del contexto de desarrollo con MCP

#### Steering Rules
- **Development Guidelines**: Reglas automáticas para guiar desarrollo
- **Code Standards**: Aplicación automática de estándares de código
- **Project Structure**: Mantenimiento automático de estructura

#### Agent Hooks
- **Auto-Testing**: Ejecución automática de tests en cambios
- **Code Validation**: Validación automática de sintaxis y estilo
- **Documentation Update**: Actualización automática de documentación
- **Deployment Checks**: Verificaciones pre-deployment

## Data Models

### Calaverita Model
```javascript
{
  id: string,           // Identificador único
  name: string,         // Nombre de la persona
  profession: string,   // Profesión u ocupación
  trait: string|null,   // Característica especial
  templateId: string,   // ID de plantilla usada
  templateName: string, // Nombre de plantilla
  text: string,         // Texto completo de la calaverita
  date: string,         // Fecha de creación
  metadata: {           // Metadatos adicionales (Nivel Catrina+)
    wordCount: number,
    generationTime: number,
    userAgent: string
  }
}
```

### Template Model
```javascript
{
  id: string,           // Identificador único
  name: string,         // Nombre descriptivo
  pattern: string,      // Plantilla con placeholders
  requiresTrait: boolean, // Si requiere característica
  description: string,  // Descripción de la plantilla
  examples: string[],   // Ejemplos de uso
  difficulty: string    // Nivel de complejidad
}
```

## Error Handling

### Nivel Ofrenda
- **Basic Validation**: Validación de campos requeridos
- **Simple Error Messages**: Mensajes de error básicos
- **Graceful Degradation**: Funcionamiento básico sin JavaScript

### Nivel Catrina
- **Advanced Validation**: Validación contextual según template
- **User-Friendly Messages**: Mensajes de error descriptivos
- **Recovery Mechanisms**: Recuperación automática de errores
- **Offline Support**: Funcionamiento básico sin conexión

### Nivel Mictlán
- **Comprehensive Logging**: Logging detallado con MCP tools
- **Automated Recovery**: Recuperación automática con hooks
- **Performance Monitoring**: Monitoreo de rendimiento
- **Development Error Handling**: Manejo de errores de desarrollo

## Testing Strategy

### Nivel Ofrenda
- **Manual Testing**: Pruebas manuales básicas de funcionalidad
- **Browser Compatibility**: Verificación en navegadores principales
- **Responsive Testing**: Pruebas en diferentes tamaños de pantalla

### Nivel Catrina
- **Unit Tests**: Tests unitarios para componentes clave
- **Integration Tests**: Tests de integración API-Frontend
- **User Experience Tests**: Tests de flujos de usuario completos
- **Performance Tests**: Tests básicos de rendimiento

### Nivel Mictlán
- **Automated Testing**: Tests automáticos con Agent Hooks
- **Continuous Validation**: Validación continua con Steering
- **MCP-Enhanced Testing**: Tests mejorados con herramientas MCP
- **End-to-End Automation**: Automatización completa del pipeline de testing

## Implementation Phases

### Phase 1: Nivel Ofrenda (Fundación)
1. Configurar estructura básica del proyecto
2. Implementar generador core con 3 plantillas
3. Crear interfaz web responsiva básica
4. Configurar persistencia local simple
5. Implementar API REST básica

### Phase 2: Nivel Catrina (Extensión)
1. Expandir sistema de plantillas a 5+
2. Implementar selector interactivo de plantillas
3. Crear visualizador avanzado de historial
4. Agregar funciones de búsqueda y filtrado
5. Implementar exportación de datos

### Phase 3: Nivel Mictlán (Integración Kiro)
1. Configurar MCP server y herramientas
2. Crear reglas de Steering para el proyecto
3. Implementar Agent Hooks para automatización
4. Integrar herramientas MCP en el flujo de desarrollo
5. Documentar completamente el stack Kiro

## Kiro Stack Integration Details

### MCP Configuration
```json
{
  "mcpServers": {
    "calaverita-tools": {
      "command": "uvx",
      "args": ["calaverita-mcp-server@latest"],
      "disabled": false,
      "autoApprove": ["generate_template", "validate_poem"]
    }
  }
}
```

### Steering Rules Structure
```markdown
# .kiro/steering/calaverita-standards.md
- Todas las plantillas deben seguir métrica tradicional
- Validar ortografía en español mexicano
- Mantener tono humorístico apropiado
- Incluir referencias culturales auténticas
```

### Agent Hooks Examples
```javascript
// .kiro/hooks/auto-test.js
// Ejecutar tests automáticamente al guardar archivos
// Validar plantillas nuevas antes de commit
// Actualizar documentación de API automáticamente
```