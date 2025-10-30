/**
 * Tests para CalaveriteGenerator
 * Generado por Auto-Test Hook
 */

const { CalaveriteGenerator } = require('../src/generator');

describe('CalaveriteGenerator', () => {
  let generator;

  beforeEach(() => {
    generator = new CalaveriteGenerator();
  });

  describe('constructor', () => {
    test('should initialize with default templates', () => {
      expect(generator).toBeDefined();
      expect(generator.templates).toBeDefined();
      expect(generator.templates.length).toBeGreaterThan(0);
    });
  });

  describe('getTemplates', () => {
    test('should return template information', () => {
      const templates = generator.getTemplates();
      
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
      
      // Verificar estructura de template
      const firstTemplate = templates[0];
      expect(firstTemplate).toHaveProperty('id');
      expect(firstTemplate).toHaveProperty('name');
      expect(firstTemplate).toHaveProperty('requiresTrait');
      expect(firstTemplate).toHaveProperty('description');
    });

    test('should include required templates', () => {
      const templates = generator.getTemplates();
      const templateIds = templates.map(t => t.id);
      
      expect(templateIds).toContain('clasica');
      expect(templateIds).toContain('catrina');
      expect(templateIds).toContain('trabajador');
    });
  });

  describe('generate', () => {
    test('should generate calaverita with basic parameters', () => {
      const result = generator.generate('Juan', 'doctor');
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'Juan');
      expect(result).toHaveProperty('profession', 'doctor');
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('templateId');
      expect(result).toHaveProperty('templateName');
    });

    test('should generate calaverita with trait', () => {
      const result = generator.generate('María', 'maestra', 'alegre');
      
      expect(result).toBeDefined();
      expect(result.name).toBe('María');
      expect(result.profession).toBe('maestra');
      expect(result.trait).toBe('alegre');
      expect(result.text).toContain('María');
      expect(result.text).toContain('maestra');
    });

    test('should include metadata', () => {
      const result = generator.generate('Pedro', 'ingeniero');
      
      expect(result.metadata).toBeDefined();
      expect(result.metadata).toHaveProperty('wordCount');
      expect(result.metadata).toHaveProperty('generationTime');
      expect(result.metadata).toHaveProperty('userAgent');
      expect(result.metadata.wordCount).toBeGreaterThan(0);
    });
  });

  describe('generateWithTemplate', () => {
    test('should generate with specific template', () => {
      const result = generator.generateWithTemplate('Ana', 'doctora', 'inteligente', 'clasica');
      
      expect(result).toBeDefined();
      expect(result.templateId).toBe('clasica');
      expect(result.text).toContain('Ana');
      expect(result.text).toContain('doctora');
      expect(result.text).toContain('inteligente');
    });

    test('should throw error for non-existent template', () => {
      expect(() => {
        generator.generateWithTemplate('Juan', 'doctor', null, 'inexistente');
      }).toThrow('Template no encontrado');
    });

    test('should throw error when trait required but not provided', () => {
      expect(() => {
        generator.generateWithTemplate('Juan', 'doctor', null, 'clasica');
      }).toThrow('Esta plantilla requiere una característica especial');
    });
  });

  describe('calculateWordCount', () => {
    test('should count words correctly', () => {
      const text = 'Aquí yace Juan, doctor querido';
      const count = generator.calculateWordCount(text);
      
      expect(count).toBe(5);
    });

    test('should handle empty text', () => {
      expect(generator.calculateWordCount('')).toBe(0);
      expect(generator.calculateWordCount(null)).toBe(0);
      expect(generator.calculateWordCount(undefined)).toBe(0);
    });

    test('should handle multiple spaces', () => {
      const text = 'Aquí  yace   Juan';
      const count = generator.calculateWordCount(text);
      
      expect(count).toBe(3);
    });
  });
});