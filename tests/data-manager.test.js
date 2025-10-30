/**
 * Tests para DataManager
 * Generado por Auto-Test Hook
 */

const { DataManager } = require('../src/data-manager');
const fs = require('fs');
const path = require('path');

describe('DataManager', () => {
  let dataManager;
  let testDataDir;

  beforeEach(() => {
    // Crear directorio temporal para tests
    testDataDir = path.join(__dirname, 'temp-data');
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
    
    dataManager = new DataManager();
    // Sobrescribir rutas para usar directorio temporal
    dataManager.dataDir = testDataDir;
    dataManager.historyFile = path.join(testDataDir, 'calaveritas.json');
  });

  afterEach(() => {
    // Limpiar directorio temporal
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  describe('constructor', () => {
    test('should initialize with current version', () => {
      expect(dataManager).toBeDefined();
      expect(dataManager.currentVersion).toBe('2.0');
    });
  });

  describe('ensureDataDirectory', () => {
    test('should create data directory if not exists', () => {
      dataManager.ensureDataDirectory();
      
      expect(fs.existsSync(dataManager.dataDir)).toBe(true);
      expect(fs.existsSync(dataManager.historyFile)).toBe(true);
    });

    test('should create initial data file with correct structure', () => {
      dataManager.ensureDataDirectory();
      
      const data = JSON.parse(fs.readFileSync(dataManager.historyFile, 'utf8'));
      expect(data).toHaveProperty('version');
      expect(data).toHaveProperty('calaveritas');
      expect(Array.isArray(data.calaveritas)).toBe(true);
    });
  });

  describe('saveCalaverita', () => {
    beforeEach(() => {
      dataManager.ensureDataDirectory();
    });

    test('should save calaverita successfully', () => {
      const calaverita = {
        id: '1',
        name: 'Juan',
        profession: 'doctor',
        text: 'Aquí yace Juan...',
        date: '2024-11-01'
      };

      const result = dataManager.saveCalaverita(calaverita);
      
      expect(result).toBe(true);
      
      const history = dataManager.getHistory();
      expect(history.length).toBe(1);
      expect(history[0].name).toBe('Juan');
    });

    test('should expand calaverita with metadata', () => {
      const calaverita = {
        id: '1',
        name: 'María',
        profession: 'maestra',
        text: 'Aquí yace María...'
      };

      dataManager.saveCalaverita(calaverita);
      const history = dataManager.getHistory();
      
      expect(history[0].metadata).toBeDefined();
      expect(history[0].metadata).toHaveProperty('wordCount');
      expect(history[0].metadata).toHaveProperty('userAgent');
      expect(history[0].metadata).toHaveProperty('createdAt');
    });
  });

  describe('getHistory', () => {
    beforeEach(() => {
      dataManager.ensureDataDirectory();
    });

    test('should return empty array when no data', () => {
      const history = dataManager.getHistory();
      
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(0);
    });

    test('should return saved calaveritas', () => {
      const calaverita1 = { id: '1', name: 'Juan', profession: 'doctor', text: 'Test 1' };
      const calaverita2 = { id: '2', name: 'María', profession: 'maestra', text: 'Test 2' };

      dataManager.saveCalaverita(calaverita1);
      dataManager.saveCalaverita(calaverita2);

      const history = dataManager.getHistory();
      expect(history.length).toBe(2);
      expect(history[0].name).toBe('Juan');
      expect(history[1].name).toBe('María');
    });
  });

  describe('clearHistory', () => {
    beforeEach(() => {
      dataManager.ensureDataDirectory();
    });

    test('should clear all calaveritas', () => {
      // Agregar algunas calaveritas
      dataManager.saveCalaverita({ id: '1', name: 'Juan', text: 'Test' });
      dataManager.saveCalaverita({ id: '2', name: 'María', text: 'Test' });

      expect(dataManager.getHistory().length).toBe(2);

      const result = dataManager.clearHistory();
      
      expect(result).toBe(true);
      expect(dataManager.getHistory().length).toBe(0);
    });

    test('should maintain file structure after clearing', () => {
      dataManager.saveCalaverita({ id: '1', name: 'Juan', text: 'Test' });
      dataManager.clearHistory();

      const data = JSON.parse(fs.readFileSync(dataManager.historyFile, 'utf8'));
      expect(data).toHaveProperty('version');
      expect(data).toHaveProperty('calaveritas');
      expect(data.calaveritas.length).toBe(0);
    });
  });

  describe('calculateWordCount', () => {
    test('should count words correctly', () => {
      expect(dataManager.calculateWordCount('Aquí yace Juan')).toBe(3);
      expect(dataManager.calculateWordCount('Una dos tres cuatro cinco')).toBe(5);
    });

    test('should handle edge cases', () => {
      expect(dataManager.calculateWordCount('')).toBe(0);
      expect(dataManager.calculateWordCount('   ')).toBe(0);
      expect(dataManager.calculateWordCount(null)).toBe(0);
      expect(dataManager.calculateWordCount(undefined)).toBe(0);
    });
  });

  describe('getHistoryStats', () => {
    beforeEach(() => {
      dataManager.ensureDataDirectory();
    });

    test('should return correct stats for empty history', () => {
      const stats = dataManager.getHistoryStats();
      
      expect(stats.total).toBe(0);
      expect(stats.version).toBe('2.0');
      expect(stats.averageWordCount).toBe(0);
    });

    test('should calculate stats correctly', () => {
      dataManager.saveCalaverita({
        id: '1',
        name: 'Juan',
        templateId: 'clasica',
        text: 'Aquí yace Juan doctor'
      });
      
      dataManager.saveCalaverita({
        id: '2',
        name: 'María',
        templateId: 'catrina',
        text: 'La flaca bonita llegó'
      });

      const stats = dataManager.getHistoryStats();
      
      expect(stats.total).toBe(2);
      expect(stats.templates).toHaveProperty('clasica', 1);
      expect(stats.templates).toHaveProperty('catrina', 1);
      expect(stats.averageWordCount).toBeGreaterThan(0);
    });
  });
});