---
inclusion: manual
---

# Desarrollo con Stack Kiro - Guía Manual

Este steering se aplica manualmente cuando se trabaja específicamente con herramientas del stack Kiro (MCP, Steering, Hooks).

## Configuración MCP (Model Context Protocol)

### Archivo de Configuración Requerido
Ubicación: `.kiro/settings/mcp.json`

```json
{
  "mcpServers": {
    "calaverita-tools": {
      "command": "uvx",
      "args": ["calaverita-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": [
        "generate_template",
        "validate_poem",
        "cultural_check"
      ]
    }
  }
}
```

### Herramientas MCP Específicas
- **generate_template**: Generar nuevas plantillas con validación cultural
- **validate_poem**: Validar métricas poéticas y estructura
- **cultural_check**: Verificar autenticidad cultural y tono apropiado

### Uso en Desarrollo
- Usar herramientas MCP para validar plantillas nuevas antes de integrar
- Aplicar cultural_check en todas las plantillas existentes
- Generar contenido asistido con contexto cultural apropiado

## Steering Rules - Configuración Avanzada

### Archivos de Steering Creados
1. **calaverita-standards.md** (always) - Estándares generales
2. **template-validation.md** (fileMatch: generator.js) - Validación de plantillas
3. **frontend-standards.md** (fileMatch: public/**) - Estándares frontend
4. **backend-standards.md** (fileMatch: src/**/*.js) - Estándares backend
5. **kiro-stack-development.md** (manual) - Este archivo

### Aplicación Contextual
- Steering automático se aplica según patrones de archivos
- Validaciones específicas por tipo de desarrollo
- Reglas culturales y poéticas siempre activas
- Estándares de código según contexto

## Agent Hooks - Automatización

### Hooks Recomendados para Implementar

#### Auto-Test Hook
```javascript
// .kiro/hooks/auto-test.js
// Trigger: onSave para archivos .js
// Acciones:
// - Ejecutar tests unitarios relevantes
// - Validar sintaxis y linting
// - Verificar plantillas contra estándares culturales
```

#### Template Validation Hook
```javascript
// .kiro/hooks/template-validator.js  
// Trigger: onFileChange para generator.js
// Acciones:
// - Validar nuevas plantillas con MCP tools
// - Verificar métricas poéticas
// - Confirmar autenticidad cultural
```

#### Documentation Update Hook
```javascript
// .kiro/hooks/auto-docs.js
// Trigger: onSave para archivos principales
// Acciones:
// - Actualizar README con nuevas plantillas
// - Generar documentación API automática
// - Validar enlaces y referencias
```

## Flujo de Desarrollo Mejorado con Kiro

### 1. Desarrollo de Nueva Plantilla
1. Editar `src/generator.js` → Steering automático se aplica
2. Usar MCP `generate_template` para asistencia
3. Validar con MCP `cultural_check` y `validate_poem`
4. Hook auto-test ejecuta validaciones
5. Commit con documentación actualizada automáticamente

### 2. Modificación de Frontend
1. Editar archivos en `public/` → Frontend steering se aplica
2. Validaciones de accesibilidad automáticas
3. Verificación de responsividad
4. Tests de interfaz ejecutados por hooks

### 3. Cambios en Backend
1. Editar archivos en `src/` → Backend steering se aplica
2. Validaciones de API y manejo de errores
3. Tests unitarios ejecutados automáticamente
4. Verificación de estructura de respuestas

## Métricas de Productividad

### Sin Stack Kiro (Desarrollo Tradicional)
- Validación manual de plantillas
- Tests ejecutados manualmente
- Documentación actualizada manualmente
- Revisión de código manual
- Tiempo estimado: 100% baseline

### Con Stack Kiro (Desarrollo Automatizado)
- Validación automática con MCP tools
- Tests ejecutados por hooks
- Documentación auto-actualizada
- Steering aplicado automáticamente
- Tiempo estimado: 60-70% del baseline
- Calidad mejorada: +40% menos errores

## Troubleshooting Stack Kiro

### Problemas Comunes MCP
- **Error uvx no encontrado**: Instalar uv/uvx según documentación
- **Servidor MCP no responde**: Verificar configuración en mcp.json
- **Herramientas no auto-aprobadas**: Revisar array autoApprove

### Problemas Steering
- **Reglas no se aplican**: Verificar inclusion y fileMatchPattern
- **Conflictos entre reglas**: Priorizar reglas más específicas
- **Performance lenta**: Optimizar patrones de archivos

### Problemas Agent Hooks
- **Hooks no se ejecutan**: Verificar triggers y permisos
- **Ejecución lenta**: Optimizar lógica de hooks
- **Errores en hooks**: Implementar manejo de errores robusto

## Comandos Útiles

### MCP
```bash
# Verificar servidores MCP
kiro mcp list

# Reiniciar servidor MCP
kiro mcp restart calaverita-tools

# Test herramientas MCP
kiro mcp test generate_template
```

### Steering
```bash
# Listar reglas activas
kiro steering list

# Validar configuración
kiro steering validate

# Aplicar reglas manualmente
kiro steering apply
```

### Hooks
```bash
# Listar hooks activos
kiro hooks list

# Ejecutar hook manualmente
kiro hooks run auto-test

# Debugging de hooks
kiro hooks debug template-validator
```

## Documentación de Referencia

Para más información sobre el stack Kiro:
- #[[file:README.md]] - Documentación principal del proyecto
- #[[file:.kiro/settings/mcp.json]] - Configuración MCP
- #[[file:package.json]] - Dependencias y scripts del proyecto