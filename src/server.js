const express = require('express');
const cors = require('cors');
const path = require('path');
const { CalaveriteGenerator } = require('./generator');
const { DataManager } = require('./data-manager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Instancias
const generator = new CalaveriteGenerator();
const dataManager = new DataManager();

// Rutas API
app.post('/api/generate', (req, res) => {
  try {
    const { name, profession, trait, templateId } = req.body;
    
    // Validación de campos requeridos
    if (!name || !profession) {
      return res.status(400).json({ 
        success: false,
        error: 'Nombre y profesión son requeridos',
        message: 'Bad Request: Faltan campos obligatorios'
      });
    }

    const calaverita = templateId 
      ? generator.generateWithTemplate(name, profession, trait, templateId)
      : generator.generate(name, profession, trait);
      
    const saved = dataManager.saveCalaverita(calaverita);
    
    if (saved) {
      res.json({ 
        success: true, 
        data: calaverita,
        message: 'Calaverita generada exitosamente'
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Error guardando calaverita',
        message: 'Server Error: No se pudo guardar la calaverita'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: Error interno del servidor'
    });
  }
});

app.get('/api/templates', (req, res) => {
  try {
    const templates = generator.getTemplates();
    res.json({ 
      success: true,
      data: templates,
      message: 'Plantillas obtenidas exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: No se pudieron obtener las plantillas'
    });
  }
});

app.get('/api/history', (req, res) => {
  try {
    const history = dataManager.getHistory();
    res.json({ 
      success: true,
      data: history,
      message: 'Historial obtenido exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: No se pudo obtener el historial'
    });
  }
});

app.delete('/api/history', (req, res) => {
  try {
    const cleared = dataManager.clearHistory();
    if (cleared) {
      res.json({ 
        success: true, 
        data: null,
        message: 'Historial limpiado exitosamente' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Error limpiando historial',
        message: 'Server Error: No se pudo limpiar el historial'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: Error interno del servidor'
    });
  }
});

// Servir la aplicación web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎭 Generador ejecutándose en http://localhost:${PORT}`);
});