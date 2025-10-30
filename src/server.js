const express = require('express');
const cors = require('cors');
const path = require('path');
const { CalaveriteGenerator } = require('./generator');
const { DataManager } = require('./data-manager');
const { CalaveriteValidator } = require('./validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Instancias
const generator = new CalaveriteGenerator();
const dataManager = new DataManager();
const validator = new CalaveriteValidator();

// Rutas API
app.post('/api/generate', (req, res) => {
  try {
    const { name, profession, trait, templateId } = req.body;
    const userAgent = req.get('User-Agent') || 'unknown';
    
    // Validación avanzada con el validator
    const validation = validator.validateInput({ name, profession, trait, templateId });
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false,
        error: 'Datos de entrada no válidos',
        message: 'Bad Request: ' + validation.errors.join(', '),
        validationErrors: validation.errors
      });
    }

    // Usar datos sanitizados
    const sanitizedData = validation.sanitizedData;
    
    const calaverita = templateId 
      ? generator.generateWithTemplate(
          sanitizedData.name, 
          sanitizedData.profession, 
          sanitizedData.trait, 
          sanitizedData.templateId, 
          userAgent
        )
      : generator.generate(
          sanitizedData.name, 
          sanitizedData.profession, 
          sanitizedData.trait, 
          userAgent
        );
      
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

app.get('/api/stats', (req, res) => {
  try {
    const stats = dataManager.getHistoryStats();
    res.json({ 
      success: true,
      data: stats,
      message: 'Estadísticas obtenidas exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: No se pudieron obtener las estadísticas'
    });
  }
});

app.get('/api/validation/rules', (req, res) => {
  try {
    const rules = validator.getValidationRules();
    res.json({ 
      success: true,
      data: rules,
      message: 'Reglas de validación obtenidas exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: No se pudieron obtener las reglas de validación'
    });
  }
});

app.post('/api/validation/field', (req, res) => {
  try {
    const { fieldName, value } = req.body;
    
    if (!fieldName) {
      return res.status(400).json({ 
        success: false,
        error: 'Campo fieldName es requerido',
        message: 'Bad Request: Falta el nombre del campo'
      });
    }

    const validation = validator.validateFieldRealTime(fieldName, value);
    res.json({ 
      success: true,
      data: validation,
      message: 'Validación de campo completada'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: Error validando campo'
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