/**
 * Tests para CalaveriteValidator
 * Generado por Auto-Test Hook
 */

const { CalaveriteValidator } = require('../src/validator');

describe('CalaveriteValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new CalaveriteValidator();
  });

  describe('constructor', () => {
    test('should initialize with default configuration', () => {
      expect(validator).toBeDefined();
      expect(validator.config).toBeDefined();
      expect(validator.forbiddenWords).toBeDefined();
      expect(validator.templateRequirements).toBeDefined();
    });
  });

  describe('validateInput', () => {
    test('should validate correct input', () => {
      const input = {
        name: 'Juan Pérez',
        profession: 'doctor',
        trait: 'alegre'
      };

      const result = validator.validateInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.sanitizedData).toBeDefined();
    });

    test('should reject empty required fields', () => {
      const input = {
        name: '',
        profession: 'doctor'
      };

      const result = validator.validateInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('nombre es requerido');
    });

    test('should reject fields that are too long', () => {
      const input = {
        name: 'A'.repeat(60), // Excede maxLength de 50
        profession: 'doctor'
      };

      const result = validator.validateInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('no puede exceder'))).toBe(true);
    });

    test('should reject invalid characters', () => {
      const input = {
        name: 'Juan<script>',
        profession: 'doctor'
      };

      const result = validator.validateInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('caracteres no válidos'))).toBe(true);
    });
  });

  describe('validateField', () => {
    test('should validate name field correctly', () => {
      const result = validator.validateField('name', 'Juan Pérez', true);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('should reject name with only numbers', () => {
      const result = validator.validateField('name', '12345', true);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('solo números'))).toBe(true);
    });

    test('should validate profession field', () => {
      const result = validator.validateField('profession', 'doctor', true);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('should validate optional trait field', () => {
      const result = validator.validateField('trait', 'alegre', false);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('should allow empty optional field', () => {
      const result = validator.validateField('trait', '', false);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });

  describe('validateByTemplate', () => {
    test('should validate template that requires trait', () => {
      const result = validator.validateByTemplate('clasica', 'inteligente');
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('should reject template that requires trait but none provided', () => {
      const result = validator.validateByTemplate('clasica', '');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('requiere una característica'))).toBe(true);
    });

    test('should validate template that does not require trait', () => {
      const result = validator.validateByTemplate('catrina', '');
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('should reject unknown template', () => {
      const result = validator.validateByTemplate('inexistente', 'alegre');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('no reconocida'))).toBe(true);
    });
  });

  describe('sanitizeData', () => {
    test('should sanitize input data', () => {
      const input = {
        name: '  Juan Pérez  ',
        profession: '  doctor  ',
        trait: '  alegre  '
      };

      const sanitized = validator.sanitizeData(input);
      
      expect(sanitized.name).toBe('Juan Pérez');
      expect(sanitized.profession).toBe('doctor');
      expect(sanitized.trait).toBe('alegre');
    });

    test('should remove HTML characters', () => {
      const input = {
        name: 'Juan<>Pérez',
        profession: 'doctor'
      };

      const sanitized = validator.sanitizeData(input);
      
      expect(sanitized.name).toBe('JuanPérez');
    });

    test('should normalize multiple spaces', () => {
      const input = {
        name: 'Juan    Pérez',
        profession: 'doctor'
      };

      const sanitized = validator.sanitizeData(input);
      
      expect(sanitized.name).toBe('Juan Pérez');
    });
  });

  describe('validateFieldRealTime', () => {
    test('should provide real-time validation feedback', () => {
      const result = validator.validateFieldRealTime('name', 'Juan');
      
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('suggestions');
    });

    test('should provide suggestions for short names', () => {
      const result = validator.validateFieldRealTime('name', 'Jo');
      
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('getValidationRules', () => {
    test('should return validation rules for frontend', () => {
      const rules = validator.getValidationRules();
      
      expect(rules).toHaveProperty('name');
      expect(rules).toHaveProperty('profession');
      expect(rules).toHaveProperty('trait');
      
      expect(rules.name.required).toBe(true);
      expect(rules.profession.required).toBe(true);
      expect(rules.trait.required).toBe(false);
    });
  });
});