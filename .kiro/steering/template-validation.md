---
inclusion: fileMatch
fileMatchPattern: '**/generator.js'
---

# Validación de Plantillas - Contexto Específico

Este steering se aplica automáticamente cuando se edita el archivo generator.js que contiene las plantillas de calaveritas.

## Validaciones Automáticas para Plantillas

### Estructura Requerida
Cada plantilla debe incluir:
```javascript
{
  id: string,           // Identificador único (kebab-case)
  name: string,         // Nombre descriptivo en español
  pattern: string,      // Texto con placeholders {name}, {profession}, {trait}
  requiresTrait: boolean, // true si requiere característica especial
  description: string,  // Descripción del estilo de la plantilla
  examples: string[]    // Al menos un ejemplo de uso
}
```

### Validación de Contenido
- **Placeholders**: Verificar que {name}, {profession} estén presentes
- **Trait condicional**: Si requiresTrait es true, debe incluir {trait}
- **Longitud**: El pattern debe generar entre 50-300 caracteres
- **Idioma**: Usar español mexicano auténtico
- **Tono**: Mantener humor apropiado y festivo

### Métricas Poéticas Automáticas
- Contar sílabas aproximadas (objetivo: 8 sílabas por verso)
- Verificar rima básica en finales de verso
- Confirmar ritmo alegre y cadencioso
- Validar que suene natural al leer en voz alta

### Ejemplos de Patrones Válidos
```javascript
// ✅ Correcto - octosílabos, rima, tono apropiado
"Aquí yace {name} querido,\n{profession} muy estimado,\nque por {trait} fue conocido,\ny ahora está descansado."

// ✅ Correcto - estilo libre pero apropiado  
"La flaca bonita llegó por {name},\n{profession} de gran renombre,\nse lo llevó sin pena ni gloria,\npara escribir su historia."

// ❌ Incorrecto - muy corto, sin estructura
"{name} murió. Era {profession}."

// ❌ Incorrecto - tono inapropiado
"{name} sufrió terriblemente como {profession}..."
```

### Validación Cultural Específica
- Evitar referencias a violencia real o tragedias
- Usar vocabulario del español mexicano
- Incluir elementos tradicionales del Día de Muertos
- Mantener respeto por la tradición poética mexicana
- Asegurar que sea apropiado para todas las edades

### Aplicación Automática
Esta validación se ejecuta cuando:
- Se agregan nuevas plantillas al array TEMPLATES
- Se modifican plantillas existentes
- Se ejecutan tests de generación
- Se hace commit de cambios en generator.js