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
