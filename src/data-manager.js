const fs = require('fs');
const path = require('path');

class DataManager {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
    this.historyFile = path.join(this.dataDir, 'calaveritas.json');
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.historyFile)) {
      fs.writeFileSync(this.historyFile, JSON.stringify([], null, 2));
    }
  }

  saveCalaverita(calaverita) {
    try {
      const history = this.getHistory();
      history.push(calaverita);
      fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));
      return true;
    } catch (error) {
      console.error('Error guardando calaverita:', error.message);
      return false;
    }
  }

  getHistory() {
    try {
      const data = fs.readFileSync(this.historyFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo historial:', error.message);
      return [];
    }
  }

  clearHistory() {
    try {
      fs.writeFileSync(this.historyFile, JSON.stringify([], null, 2));
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
}

module.exports = { DataManager };