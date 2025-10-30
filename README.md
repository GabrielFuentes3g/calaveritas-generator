# 🎭 Generador de Calaveritas 💀

Generador de calaveritas personalizadas del Día de Muertos - Una aplicación local interactiva.

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar la aplicación web
npm start

# Modo desarrollo (con auto-reload)
npm run dev
```

Luego abre tu navegador en: **http://localhost:3000**

## ✨ Características

- 🌐 **Aplicación web** con interfaz gráfica moderna
- 🎨 **5 plantillas diferentes** de calaveritas personalizadas
- 💾 **Persistencia local** automática en JSON
- 📚 **Historial completo** con vista previa
- 🎭 **Selector de plantillas** o generación aleatoria
- 📱 **Diseño responsivo** para móviles y desktop
- 🎨 **Tema del Día de Muertos** con colores y emojis

## 📁 Estructura del Proyecto

```
calaveritas-generator/
├── src/
│   ├── server.js        # Servidor Express
│   ├── generator.js     # Lógica de generación
│   └── data-manager.js  # Manejo de persistencia
├── public/
│   ├── index.html       # Interfaz web
│   ├── styles.css       # Estilos del Día de Muertos
│   └── frontend.js      # Lógica del cliente
├── data/                # Datos locales (auto-generado)
├── package.json
└── README.md
```

## 🎯 Cómo Funciona

1. **Completa el formulario** con nombre, profesión y características
2. **Elige una plantilla** específica o deja que sea sorpresa
3. **Genera tu calaverita** personalizada al instante
4. **Revisa el historial** de todas las calaveritas creadas
5. **Persistencia automática** - todo se guarda localmente

### 📜 Plantillas Disponibles:
- **Clásica** - Estilo tradicional (requiere característica)
- **La Catrina** - Con la flaca bonita
- **El Trabajador** - Para gente trabajadora
- **El Respetado** - Para personas admiradas (requiere característica)
- **De la Montaña** - Estilo rústico y sencillo

¡Perfecto para celebrar el Día de Muertos con humor y tradición! 🌺

## 🔧 Kiro Stack Integration

### MCP (Model Context Protocol) Configuration

Este proyecto incluye integración completa con el stack de Kiro, incluyendo configuración MCP para herramientas avanzadas de desarrollo.

#### Instalación de uv/uvx

Para usar las herramientas MCP, necesitas instalar `uv` y `uvx`:

**Windows (PowerShell):**
```powershell
# Opción 1: Usando pip
pip install uv

# Opción 2: Usando Chocolatey
choco install uv

# Opción 3: Descarga directa
Invoke-WebRequest -Uri https://astral.sh/uv/install.ps1 | Invoke-Expression
```

**macOS/Linux:**
```bash
# Usando curl
curl -LsSf https://astral.sh/uv/install.sh | sh

# Usando brew (macOS)
brew install uv

# Usando pip
pip install uv
```

#### Configuración MCP

El archivo `.kiro/settings/mcp.json` está configurado con herramientas específicas para calaveritas:

```json
{
  "mcpServers": {
    "calaverita-tools": {
      "command": "uvx",
      "args": ["calaverita-mcp-server@latest"],
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

#### Herramientas MCP Disponibles

1. **generate_template**: Genera nuevas plantillas de calaveritas con contexto cultural
2. **validate_poem**: Valida métricas poéticas y estructura tradicional
3. **cultural_check**: Verifica autenticidad cultural y tono apropiado

#### Verificación de Instalación

```bash
# Verificar instalación de uv
uv --version

# Verificar uvx
uvx --version

# Probar servidor MCP (opcional)
uvx calaverita-mcp-server@latest --help
```

#### Uso en Desarrollo

Las herramientas MCP se integran automáticamente en el flujo de desarrollo de Kiro:

- **Validación automática** de nuevas plantillas
- **Generación asistida** de contenido cultural
- **Verificación de autenticidad** en tiempo real
- **Métricas poéticas** tradicionales

**📋 Flujo de Desarrollo Completo**: Ver [docs/mcp-development-workflow.md](docs/mcp-development-workflow.md) para guía detallada del proceso MCP → Validación → Integración.

#### Troubleshooting MCP

**Problema: "uvx command not found"**
- Solución: Instalar uv siguiendo las instrucciones arriba
- Verificar que uv esté en el PATH del sistema

**Problema: "MCP server not responding"**
- Solución: Verificar conexión a internet para descargar el servidor
- Reiniciar Kiro después de cambios en configuración MCP

**Problema: "Auto-approve not working"**
- Solución: Verificar que las herramientas estén listadas correctamente en autoApprove
- Reconectar servidor MCP desde el panel de Kiro

#### Beneficios del Stack Kiro

- **Desarrollo acelerado** con herramientas contextuales
- **Validación automática** de contenido cultural
- **Calidad mejorada** con métricas poéticas tradicionales
- **Flujo integrado** de desarrollo y validación


## 🎭 Plantillas Disponibles

El generador incluye 5 plantillas únicas:

### 1. Clásica (`clasica`)

**Descripción:** Estilo tradicional que resalta una característica especial de la persona

**Requiere característica:** ✅ Sí

**Ejemplo de patrón:** "Aquí yace {name}, {profession} querido,\nque por {..."

---

### 2. La Catrina (`catrina`)

**Descripción:** Invoca a la elegante Catrina para llevarse al personaje con gracia

**Requiere característica:** ❌ No

**Ejemplo de patrón:** "La flaca bonita llegó por {name},\n{profession} de..."

---

### 3. El Trabajador (`trabajador`)

**Descripción:** Celebra la dedicación laboral y el buen humor del personaje

**Requiere característica:** ❌ No

**Ejemplo de patrón:** "{name} el {profession} trabajador,\nsiempre fue de..."

---

### 4. El Respetado (`respetado`)

**Descripción:** Honra a personas respetadas destacando su cualidad más admirada

**Requiere característica:** ✅ Sí

**Ejemplo de patrón:** "Don {name}, {profession} respetado,\npor {trait} e..."

---

### 5. De la Montaña (`montaña`)

**Descripción:** Estilo narrativo que cuenta la historia como un cuento tradicional

**Requiere característica:** ❌ No

**Ejemplo de patrón:** "Había una vez {name},\n{profession} de buena gana...."

---

### Uso de Plantillas

```javascript
// Generar con plantilla específica
const calaverita = generator.generateWithTemplate(
  'Juan',      // nombre
  'doctor',    // profesión
  'alegre',    // característica (opcional según plantilla)
  'clasica'    // ID de plantilla
);
```



## 📡 API Reference

La aplicación expone los siguientes endpoints REST:

- **POST** `/api/generate` - Rutas API
- **GET** `/api/templates` - Endpoint sin descripción
- **GET** `/api/history` - Endpoint sin descripción
- **GET** `/api/history/search` - Endpoint sin descripción
- **DELETE** `/api/history` - Endpoint sin descripción
- **GET** `/api/stats` - Endpoint sin descripción
- **GET** `/api/validation/rules` - Endpoint sin descripción
- **POST** `/api/validation/field` - Endpoint sin descripción
- **POST** `/api/validation/contextual` - Endpoint sin descripción
- **POST** `/api/export` - Endpoint sin descripción
- **GET** `/api/mcp/status` - MCP Integration Endpoints
- **POST** `/api/mcp/validate-template` - Endpoint sin descripción
- **POST** `/api/mcp/generate-template` - Endpoint sin descripción
- **POST** `/api/mcp/generate-enhanced` - Endpoint sin descripción
- **GET** `/` - Servir la aplicación web

📖 **Documentación completa:** [docs/api.md](docs/api.md)

