const fs = require('fs');
const path = require('path');

class DataManager {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
    this.historyFile = path.join(this.dataDir, 'calaveritas.json');
    this.currentVersion = '2.0'; // Versión actual del modelo de datos
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.historyFile)) {
      const initialData = {
        version: this.currentVersion,
        calaveritas: []
      };
      fs.writeFileSync(this.historyFile, JSON.stringify(initialData, null, 2));
    }
  }

  saveCalaverita(calaverita) {
    try {
      const data = this.loadDataFile();
      
      // Expandir calaverita con metadatos si no los tiene
      const expandedCalaverita = this.expandCalaveriteData(calaverita);
      
      data.calaveritas.push(expandedCalaverita);
      data.version = this.currentVersion;
      
      fs.writeFileSync(this.historyFile, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error guardando calaverita:', error.message);
      return false;
    }
  }

  getHistory() {
    try {
      const data = this.loadDataFile();
      return data.calaveritas || [];
    } catch (error) {
      console.error('Error leyendo historial:', error.message);
      return [];
    }
  }

  clearHistory() {
    try {
      const data = {
        version: this.currentVersion,
        calaveritas: []
      };
      fs.writeFileSync(this.historyFile, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error limpiando historial:', error.message);
      return false;
    }
  }

  getCalaveritaById(id) {
    const history = this.getHistory();
    return history.find(calaverita => calaverita.id === id);
  }

  // Cargar archivo de datos con compatibilidad hacia atrás
  loadDataFile() {
    try {
      const rawData = fs.readFileSync(this.historyFile, 'utf8');
      const parsedData = JSON.parse(rawData);
      
      // Compatibilidad con formato anterior (array directo)
      if (Array.isArray(parsedData)) {
        console.log('Migrando datos del formato anterior...');
        const migratedData = {
          version: '1.0',
          calaveritas: parsedData.map(calaverita => this.migrateCalaveriteData(calaverita))
        };
        // Guardar datos migrados
        fs.writeFileSync(this.historyFile, JSON.stringify(migratedData, null, 2));
        return migratedData;
      }
      
      // Formato nuevo con versionado
      return parsedData;
    } catch (error) {
      console.error('Error cargando archivo de datos:', error.message);
      return {
        version: this.currentVersion,
        calaveritas: []
      };
    }
  }

  // Migrar datos del formato anterior al nuevo
  migrateCalaveriteData(oldCalaverita) {
    return {
      ...oldCalaverita,
      metadata: {
        wordCount: this.calculateWordCount(oldCalaverita.text || ''),
        generationTime: 0, // No disponible en datos anteriores
        userAgent: 'migrated-data',
        migratedFrom: '1.0'
      }
    };
  }

  // Expandir calaverita con metadatos completos
  expandCalaveriteData(calaverita, userAgent = 'server') {
    const startTime = Date.now();
    
    const expanded = {
      ...calaverita,
      metadata: {
        wordCount: this.calculateWordCount(calaverita.text || ''),
        generationTime: Date.now() - startTime,
        userAgent: userAgent,
        createdAt: new Date().toISOString(),
        version: this.currentVersion
      }
    };

    return expanded;
  }

  // Calcular número de palabras en el texto
  calculateWordCount(text) {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  // Obtener estadísticas del historial
  getHistoryStats() {
    try {
      const data = this.loadDataFile();
      const calaveritas = data.calaveritas || [];
      
      return {
        total: calaveritas.length,
        version: data.version,
        templates: this.getTemplateStats(calaveritas),
        averageWordCount: this.getAverageWordCount(calaveritas),
        dateRange: this.getDateRange(calaveritas)
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error.message);
      return {
        total: 0,
        version: this.currentVersion,
        templates: {},
        averageWordCount: 0,
        dateRange: null
      };
    }
  }

  // Estadísticas por plantilla
  getTemplateStats(calaveritas) {
    const stats = {};
    calaveritas.forEach(calaverita => {
      const templateId = calaverita.templateId || 'unknown';
      stats[templateId] = (stats[templateId] || 0) + 1;
    });
    return stats;
  }

  // Promedio de palabras
  getAverageWordCount(calaveritas) {
    if (calaveritas.length === 0) return 0;
    
    const totalWords = calaveritas.reduce((sum, calaverita) => {
      const wordCount = calaverita.metadata?.wordCount || this.calculateWordCount(calaverita.text || '');
      return sum + wordCount;
    }, 0);
    
    return Math.round(totalWords / calaveritas.length);
  }

  // Rango de fechas
  getDateRange(calaveritas) {
    if (calaveritas.length === 0) return null;
    
    const dates = calaveritas
      .map(c => c.metadata?.createdAt || c.date)
      .filter(date => date)
      .sort();
    
    return {
      oldest: dates[0],
      newest: dates[dates.length - 1]
    };
  }
}

module.exports = { DataManager };