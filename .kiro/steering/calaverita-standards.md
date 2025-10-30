---
inclusion: always
---

# Estándares de Desarrollo - Generador de Calaveritas

Este documento define los estándares automáticos que se aplicarán durante el desarrollo del Generador de Calaveritas del Día de Muertos para el Code of the Dead Challenge.

## Métricas Poéticas Tradicionales

### Estructura de Calaveritas
- **Métrica**: Preferir octosílabos (8 sílabas por verso) cuando sea posible
- **Rima**: Usar rima consonante o asonante tradicional
- **Longitud**: Entre 4-8 versos por calaverita para mantener tradición
- **Ritmo**: Mantener cadencia alegre y juguetona característica del género

### Validación de Contenido Poético
- Verificar que cada plantilla mantenga el tono humorístico apropiado
- Asegurar que las referencias a la muerte sean ligeras y festivas
- Validar que los placeholders {name}, {profession}, {trait} se integren naturalmente
- Confirmar que el resultado final suene como español mexicano auténtico

## Validación Cultural

### Referencias Auténticas
- Usar vocabulario y expresiones del español mexicano
- Incluir referencias culturales apropiadas del Día de Muertos
- Evitar anglicismos innecesarios en el contenido de las calaveritas
- Mantener respeto por la tradición mientras se permite creatividad

### Tono Apropiado
- Las calaveritas deben ser humorísticas, nunca ofensivas
- Evitar referencias a violencia real o temas sensibles
- Mantener el espíritu festivo y celebratorio del Día de Muertos
- Asegurar que el contenido sea apropiado para todas las edades

## Estructura de Código

### Naming Conventions
- **Clases**: PascalCase (ej: `CalaveriteGenerator`, `DataManager`)
- **Funciones y métodos**: camelCase (ej: `generateCalaverita`, `saveToHistory`)
- **Variables**: camelCase (ej: `templateId`, `userInput`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `DEFAULT_TEMPLATES`, `MAX_NAME_LENGTH`)
- **Archivos**: kebab-case para CSS/HTML, camelCase para JS (ej: `styles.css`, `dataManager.js`)

### Organización de Archivos
```
src/
├── server.js          // Servidor Express principal
├── generator.js       // Lógica de generación de calaveritas
├── data-manager.js    // Manejo de persistencia
└── validator.js       // Validaciones de entrada

public/
├── index.html         // Interfaz principal
├── styles.css         // Estilos temáticos
└── frontend.js        // Lógica del cliente

data/
└── calaveritas.json   // Persistencia local (auto-generado)
```

### Estándares de Código JavaScript
- Usar `const` por defecto, `let` cuando sea necesario, evitar `var`
- Implementar manejo de errores con try/catch en operaciones asíncronas
- Documentar funciones públicas con JSDoc cuando sea apropiado
- Mantener funciones pequeñas y con responsabilidad única
- Usar destructuring para objetos y arrays cuando mejore legibilidad

## Guías de Desarrollo

### Testing
- Escribir tests unitarios para lógica de generación de calaveritas
- Probar validaciones de entrada y manejo de errores
- Verificar persistencia de datos y recuperación
- Validar que las plantillas generen contenido apropiado
- Tests deben ser rápidos y determinísticos

### Documentación
- Mantener README.md actualizado con instrucciones claras
- Documentar API endpoints con ejemplos de uso
- Incluir ejemplos de calaveritas generadas en documentación
- Explicar configuración del stack Kiro cuando sea aplicable

### Commits
- Usar mensajes descriptivos en español o inglés consistentemente
- Prefijos recomendados: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- Incluir referencia a requirements cuando sea relevante
- Commits pequeños y atómicos que representen cambios lógicos

## Validaciones Específicas por Tipo de Archivo

### Archivos de Plantillas (templates)
- Verificar que cada plantilla tenga estructura válida
- Confirmar que los placeholders estén correctamente definidos
- Validar que `requiresTrait` esté configurado apropiadamente
- Asegurar que las plantillas generen texto coherente

### Archivos de Configuración
- Validar sintaxis JSON en archivos de configuración
- Verificar que las dependencias en package.json estén actualizadas
- Confirmar que los scripts npm funcionen correctamente
- Asegurar que .gitignore incluya archivos apropiados

### Archivos de Interfaz (HTML/CSS/JS)
- Validar HTML semántico y accesible
- Verificar que CSS sea responsivo (móvil-first)
- Confirmar que JavaScript maneje errores apropiadamente
- Asegurar que la interfaz refleje el tema del Día de Muertos

## Referencias a Archivos del Proyecto

Para validaciones específicas, consultar:
- #[[file:data/calaveritas.json]] - Estructura de datos persistidos
- #[[file:src/generator.js]] - Lógica principal de generación
- #[[file:public/styles.css]] - Estándares de diseño visual
- #[[file:package.json]] - Configuración de dependencias y scripts

## Aplicación Automática

Estas reglas se aplicarán automáticamente durante:
- Creación y modificación de plantillas de calaveritas
- Desarrollo de nuevas funcionalidades
- Refactoring de código existente
- Revisión de pull requests y commits
- Ejecución de tests y validaciones

## Excepciones y Flexibilidad

- Las reglas poéticas son guías, no restricciones absolutas
- La creatividad cultural es bienvenida dentro del respeto tradicional
- Los estándares de código pueden adaptarse para casos específicos
- La documentación puede expandirse según necesidades del proyecto