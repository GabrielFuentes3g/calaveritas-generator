const express = require('express');
const cors = require('cors');
const path = require('path');
const { CalaveriteGenerator } = require('./generator');
const { DataManager } = require('./data-manager');

const app = express();
const PORT = process.env.PORT || 8080;

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
    
    if (!name || !profession) {
      return res.status(400).json({ 
        error: 'Nombre y profesión son requeridos' 
      });
    }

    const calaverita = templateId 
      ? generator.generateWithTemplate(name, profession, trait, templateId)
      : generator.generate(name, profession, trait);
      
    const saved = dataManager.saveCalaverita(calaverita);
    
    if (saved) {
      res.json({ success: true, calaverita });
    } else {
      res.status(500).json({ error: 'Error guardando calaverita' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/templates', (req, res) => {
  try {
    const templates = generator.getTemplates();
    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/history', (req, res) => {
  try {
    const history = dataManager.getHistory();
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/history', (req, res) => {
  try {
    const cleared = dataManager.clearHistory();
    if (cleared) {
      res.json({ success: true, message: 'Historial limpiado' });
    } else {
      res.status(500).json({ error: 'Error limpiando historial' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Servir la aplicación web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎭 Generador de Calaveritas ejecutándose en http://localhost:${PORT}`);
  console.log('💀 ¡Abre tu navegador y comienza a crear calaveritas!');
});