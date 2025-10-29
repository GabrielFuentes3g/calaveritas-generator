# Requirements Document - Code of the Dead Challenge

## Introduction

El Code of the Dead Challenge es una competencia de desarrollo para JSConf MX 2025 que requiere crear un **Generador de Calaveritas del Día de Muertos**. La aplicación debe cumplir con tres niveles progresivos de funcionalidad: **Nivel Ofrenda (básico)**, **Nivel Catrina (avanzado)**, y **Nivel Mictlán (bonus con stack completo de Kiro)**.

Este documento define los requisitos funcionales, de interfaz, persistencia, estructura de proyecto, accesibilidad y experiencia de usuario.

---

## Glossary

- **Calaverita**: Poema tradicional mexicano del Día de Muertos que habla de la muerte de manera humorística.
- **Generador_App**: La aplicación web completa del generador de calaveritas.
- **Template_System**: Sistema de plantillas predefinidas para generar calaveritas.
- **History_Manager**: Componente que maneja la persistencia y visualización del historial.
- **UI_Interface**: Interfaz de usuario web responsiva.
- **MCP_Integration**: Integración con Model Context Protocol de Kiro.
- **Steering_Rules**: Reglas de dirección automática de Kiro.
- **Agent_Hooks**: Ganchos automáticos de agente de Kiro.
- **Export_Manager**: Componente que permite exportar calaveritas como imagen o PDF.

---

## Requirements

### Requirement 1 - Nivel Ofrenda (Básico)

**User Story:** Como usuario del challenge, quiero una aplicación web funcional con diseño responsivo, para que pueda generar calaveritas básicas desde cualquier dispositivo.

#### Acceptance Criteria

1. WHEN un usuario accede a la aplicación, THE Generador_App SHALL mostrar una interfaz web completamente funcional.
2. WHEN un usuario ingresa datos en el formulario, THE Generador_App SHALL generar una calaverita personalizada.
3. WHEN un usuario accede desde dispositivos móviles o desktop, THE UI_Interface SHALL adaptarse responsivamente al tamaño de pantalla.
4. WHEN un usuario completa el formulario básico, THE Template_System SHALL usar al menos 3 plantillas diferentes.
5. THE Generador_App SHALL ejecutarse correctamente con `npm start` en puerto 3000.
6. THE UI_Interface SHALL mostrar mensajes de error claros si los campos están vacíos.
7. THE UI_Interface SHALL validar longitud máxima de nombre (50 caracteres) y mensaje (200 caracteres).

---

### Requirement 2 - Nivel Catrina (Avanzado)

**User Story:** Como usuario avanzado del challenge, quiero features interactivas y persistencia de datos, para que pueda tener una experiencia completa y mis calaveritas se guarden.

#### Acceptance Criteria

1. WHEN un usuario selecciona una plantilla específica, THE Template_System SHALL generar calaveritas usando esa plantilla exacta.
2. WHEN un usuario genera múltiples calaveritas, THE History_Manager SHALL persistir todos los datos localmente en `data/calaveritas.json`.
3. WHEN un usuario revisa el historial, THE UI_Interface SHALL mostrar todas las calaveritas creadas con vista previa.
4. WHEN un usuario limpia el historial, THE History_Manager SHALL eliminar todos los datos persistidos.
5. THE Generador_App SHALL incluir al menos 5 plantillas diferentes con características únicas.
6. WHEN un usuario revisa el historial, THE History_Manager SHALL permitir ordenar calaveritas por fecha y eliminar individualmente.
7. WHEN un usuario interactúa con la aplicación, THE UI_Interface SHALL proporcionar feedback visual inmediato y animaciones al generar calaveritas.
8. THE UI_Interface SHALL incluir colores vivos, elementos gráficos y emojis relacionados con el Día de Muertos.

---

### Requirement 3 - Nivel Mictlán (Bonus)

**User Story:** Como desarrollador experto del challenge, quiero usar todo el stack de Kiro incluyendo MCP, Steering y Hooks, para que demuestre dominio completo de las herramientas avanzadas.

#### Acceptance Criteria

1. WHEN el proyecto se configura, THE MCP_Integration SHALL incluir al menos un servidor MCP funcional.
2. WHEN se ejecutan tareas de desarrollo, THE Steering_Rules SHALL guiar automáticamente el proceso de desarrollo.
3. WHEN ocurren eventos específicos en el IDE, THE Agent_Hooks SHALL ejecutar acciones automáticas predefinidas.
4. WHEN se actualiza el código, THE Agent_Hooks SHALL ejecutar validaciones o tests automáticamente.
5. THE Generador_App SHALL documentar completamente el uso de MCP, Steering y Hooks en el README.
6. THE Generador_App SHALL incluir al menos 3 tests unitarios que validen generación de calaveritas y persistencia de datos.
7. WHEN un usuario genera una calaverita, THE Export_Manager SHALL permitir exportarla como imagen PNG o PDF.
8. THE Generador_App SHALL incluir instrucciones completas de ejecución y ejemplos en README.md para todos los features avanzados.

---

### Requirement 4 - Estructura y Organización

**User Story:** Como evaluador del challenge, quiero una estructura de proyecto clara y bien organizada, para que pueda evaluar fácilmente todos los componentes requeridos.

#### Acceptance Criteria

1. THE Generador_App SHALL organizar el código en carpetas `src/` y `public/` claramente separadas.
2. THE Generador_App SHALL incluir documentación completa en `README.md` con instrucciones de instalación y uso.
3. WHEN se revisa el proyecto, THE Generador_App SHALL incluir todos los archivos de configuración necesarios (`package.json`, `.gitignore`, etc.).
4. THE Generador_App SHALL seguir mejores prácticas de estructura de proyecto Node.js.
5. WHEN se ejecutan comandos `npm`, THE Generador_App SHALL funcionar sin errores de dependencias.

---

### Requirement 5 - Experiencia de Usuario

**User Story:** Como usuario final, quiero una experiencia temática del Día de Muertos atractiva y funcional, para que disfrute usando la aplicación.

#### Acceptance Criteria

1. WHEN un usuario ve la interfaz, THE UI_Interface SHALL usar colores y elementos visuales del Día de Muertos.
2. WHEN un usuario genera una calaverita, THE UI_Interface SHALL mostrar el resultado de manera atractiva y legible.
3. WHEN un usuario navega por la aplicación, THE UI_Interface SHALL proporcionar navegación intuitiva.
4. WHEN un usuario interactúa con formularios, THE UI_Interface SHALL validar datos y mostrar mensajes de error claros.
5. THE UI_Interface SHALL incluir microinteracciones y animaciones suaves al generar calaveritas.
6. THE UI_Interface SHALL cumplir estándares básicos de accesibilidad (contraste, navegación por teclado, legibilidad).

---

### Requirement 6 - Testing y Validación

**User Story:** Como desarrollador, quiero asegurar que la aplicación funcione correctamente, para garantizar calidad y estabilidad.

#### Acceptance Criteria

1. THE Generador_App SHALL incluir tests unitarios para:  
   - Generación de calaveritas.  
   - Persistencia local de datos.  
   - Funcionalidad de exportación.
2. WHEN se ejecuta `npm test`, THE Generador_App SHALL correr todos los tests sin errores.
3. THE README SHALL documentar cómo ejecutar los tests y validar la aplicación.

---

### Requirement 7 - Extras opcionales (diferenciadores)

**User Story:** Como participante que busca destacar, quiero incluir features opcionales, para que la app sea más atractiva y cumpla nivel Mictlán completo.

#### Acceptance Criteria

1. THE Generador_App MAY incluir opción de personalizar colores, estilos de texto y emojis en calaveritas.
2. THE Generador_App MAY permitir compartir calaveritas vía link o descarga directa.
3. THE Generador_App MAY mostrar notificaciones visuales o sonidos cortos al generar calaveritas.
4. THE Generador_App MAY incluir mini tutorial o tips de uso dentro de la app.

---

**Fin del Documento**
