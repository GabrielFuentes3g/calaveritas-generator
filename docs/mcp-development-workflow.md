# MCP Development Workflow - Calaveritas Generator

## Flujo de Desarrollo Mejorado: MCP → Validación → Integración

Este documento describe cómo usar las herramientas MCP (Model Context Protocol) para mejorar el proceso de desarrollo de plantillas de calaveritas.

## 🔄 Workflow Overview

```
1. Desarrollo/Creación → 2. Validación MCP → 3. Integración → 4. Testing
     ↓                        ↓                   ↓            ↓
   Plantilla Nueva      Cultural + Poetic     Agregar al      Validar
   o Modificación       Validation Tools      Sistema         Funcionamiento
```

## 🛠️ Herramientas MCP Disponibles

### 1. `generate_template`
**Propósito**: Generar nuevas plantillas con contexto cultural auténtico

**Uso en desarrollo**:
```javascript
// Ejemplo de uso programático
const newTemplate = await generator.generateTemplateWithMCP('artista', 'moderno');

// Ejemplo de API call
POST /api/mcp/generate-template
{
  "theme": "artista",
  "style": "tradicional"
}
```

**Casos de uso**:
- Crear plantillas para nuevas profesiones
- Generar variaciones de estilos existentes
- Explorar temas culturales específicos

### 2. `validate_poem`
**Propósito**: Validar métricas poéticas y estructura tradicional

**Métricas evaluadas**:
- Conteo de líneas (4-6 líneas óptimo)
- Esquemas de rima (ABAB, AABB, ABCB)
- Estructura silábica (octosílabos/endecasílabos)
- Ritmo y cadencia tradicional

**Uso en desarrollo**:
```javascript
// Validar plantilla existente
const validation = await generator.validateTemplateWithMCP(template);
console.log(`Puntuación poética: ${validation.poeticScore}/100`);
```

### 3. `cultural_check`
**Propósito**: Verificar autenticidad cultural y tono apropiado

**Elementos validados**:
- Referencias culturales auténticas
- Tono humorístico respetuoso
- Vocabulario tradicional mexicano
- Evitar elementos inapropiados

## 📋 Proceso de Desarrollo Paso a Paso

### Paso 1: Creación de Plantilla

```javascript
// 1. Crear plantilla base
const newTemplate = {
  id: 'mi_nueva_plantilla',
  name: 'Mi Nueva Plantilla',
  pattern: "Aquí va el patrón con {name} y {profession}...",
  requiresTrait: true,
  description: "Descripción de la plantilla"
};
```

### Paso 2: Validación MCP

```javascript
// 2. Validar con herramientas MCP
const validation = await generator.validateTemplateWithMCP(newTemplate);

if (validation.shouldIntegrate) {
  console.log('✅ Plantilla lista para integración');
  console.log(`📊 Cultural: ${validation.culturalScore}/100`);
  console.log(`🎵 Poética: ${validation.poeticScore}/100`);
} else {
  console.log('❌ Plantilla necesita mejoras:');
  validation.suggestions.forEach(suggestion => {
    console.log(`   - ${suggestion}`);
  });
}
```

### Paso 3: Integración

```javascript
// 3. Integrar al sistema si pasa validación
const result = await generator.addTemplateWithValidation(newTemplate);

if (result.success) {
  console.log('🎉 Plantilla integrada exitosamente');
} else {
  console.log('🔧 Aplicar sugerencias y reintentar');
}
```

### Paso 4: Testing

```javascript
// 4. Probar la nueva plantilla
const testCalaverita = generator.generateWithTemplate(
  'Juan Pérez',
  'programador',
  'creativo',
  'mi_nueva_plantilla'
);

console.log('🎭 Calaverita de prueba:');
console.log(testCalaverita.text);
```

## 🎯 Casos de Uso Específicos

### Caso 1: Agregar Nueva Profesión

```javascript
// Generar plantilla para "influencer"
const influencerTemplate = await generator.generateTemplateWithMCP('influencer', 'moderno');

// Validar culturalmente
const validation = await generator.validateTemplateWithMCP(influencerTemplate);

// Integrar si es apropiado
if (validation.culturalScore >= 70) {
  await generator.addTemplateWithValidation(influencerTemplate);
}
```

### Caso 2: Mejorar Plantilla Existente

```javascript
// Obtener plantilla existente
const existingTemplate = generator.templates.find(t => t.id === 'trabajador');

// Validar con MCP
const validation = await generator.validateTemplateWithMCP(existingTemplate);

// Aplicar sugerencias si es necesario
if (validation.suggestions.length > 0) {
  console.log('Sugerencias de mejora:');
  validation.suggestions.forEach(s => console.log(`- ${s}`));
}
```

### Caso 3: Generación Contextual

```javascript
// Generar calaverita con contexto MCP mejorado
const enhancedCalaverita = await generator.generateWithMCPContext(
  'María García',
  'doctora',
  'compasiva'
);

// Revisar validación MCP incluida
console.log('Validación MCP:', enhancedCalaverita.metadata.mcpValidation);
```

## 📊 Métricas de Calidad

### Puntuaciones MCP

- **Cultural Score (70-100)**: Excelente autenticidad cultural
- **Cultural Score (50-69)**: Aceptable, con mejoras menores
- **Cultural Score (<50)**: Requiere revisión significativa

- **Poetic Score (60-100)**: Cumple métricas tradicionales
- **Poetic Score (40-59)**: Estructura básica aceptable
- **Poetic Score (<40)**: Necesita reestructuración poética

### Criterios de Integración

```javascript
const shouldIntegrate = validation.isValid && 
                       validation.culturalScore >= 70 && 
                       validation.poeticScore >= 60;
```

## 🚀 Beneficios del Workflow MCP

### Para Desarrolladores

1. **Validación Automática**: No más revisión manual de contenido cultural
2. **Generación Asistida**: Ideas y estructuras generadas automáticamente
3. **Calidad Consistente**: Métricas objetivas de calidad poética
4. **Flujo Integrado**: Herramientas integradas en el proceso de desarrollo

### Para el Producto

1. **Autenticidad Cultural**: Contenido culturalmente apropiado y auténtico
2. **Calidad Poética**: Métricas tradicionales respetadas
3. **Escalabilidad**: Fácil agregar nuevas plantillas con calidad garantizada
4. **Consistencia**: Tono y estilo consistente en todas las plantillas

## 🔧 Configuración y Troubleshooting

### Verificar Estado MCP

```javascript
// Obtener estado de integración MCP
const status = generator.getMCPStatus();
console.log('MCP habilitado:', status.mcpEnabled);
console.log('Herramientas disponibles:', status.availableTools);
```

### API Endpoints para Testing

```bash
# Verificar estado MCP
GET /api/mcp/status

# Validar plantilla
POST /api/mcp/validate-template
{
  "template": {
    "name": "Test",
    "pattern": "Patrón de prueba..."
  }
}

# Generar nueva plantilla
POST /api/mcp/generate-template
{
  "theme": "artista",
  "style": "tradicional"
}

# Generar calaverita con contexto MCP
POST /api/mcp/generate-enhanced
{
  "name": "Juan",
  "profession": "artista",
  "trait": "creativo"
}
```

## 📝 Mejores Prácticas

1. **Siempre validar** nuevas plantillas con MCP antes de integrar
2. **Revisar sugerencias** y aplicar mejoras recomendadas
3. **Mantener puntuaciones** culturales >70 y poéticas >60
4. **Documentar cambios** y razones para decisiones de integración
5. **Probar funcionamiento** después de cada integración

## 🎭 Conclusión

El workflow MCP → Validación → Integración garantiza que todas las plantillas mantengan la autenticidad cultural y calidad poética tradicional, mientras acelera el proceso de desarrollo con herramientas automatizadas inteligentes.