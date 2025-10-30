class CalaveriteValidator {
  constructor() {
    // Configuración de validación
    this.config = {
      name: {
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
        forbiddenChars: /[<>{}[\]\\\/\|`~!@#$%^&*()+=]/
      },
      profession: {
        minLength: 2,
        maxLength: 30,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
        forbiddenChars: /[<>{}[\]\\\/\|`~!@#$%^&*()+=]/
      },
      trait: {
        minLength: 2,
        maxLength: 25,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
        forbiddenChars: /[<>{}[\]\\\/\|`~!@#$%^&*()+=]/
      }
    };

    // Palabras prohibidas o inapropiadas
    this.forbiddenWords = [
      'muerte', 'muerto', 'cadáver', 'difunto', // Evitar redundancia temática
      'idiota', 'estúpido', 'tonto', // Palabras ofensivas básicas
    ];

    // Plantillas que requieren características específicas
    this.templateRequirements = {
      'clasica': { requiresTrait: true, traitType: 'positive' },
      'catrina': { requiresTrait: false },
      'trabajador': { requiresTrait: false },
      'respetado': { requiresTrait: true, traitType: 'positive' },
      'montaña': { requiresTrait: false }
    };
  }

  // Validación completa de datos de entrada
  validateInput(data) {
    const errors = [];
    const { name, profession, trait, templateId } = data;

    // Validar nombre
    const nameValidation = this.validateField('name', name, true);
    if (!nameValidation.isValid) {
      errors.push(...nameValidation.errors);
    }

    // Validar profesión
    const professionValidation = this.validateField('profession', profession, true);
    if (!professionValidation.isValid) {
      errors.push(...professionValidation.errors);
    }

    // Validar característica (si se proporciona)
    if (trait) {
      const traitValidation = this.validateField('trait', trait, false);
      if (!traitValidation.isValid) {
        errors.push(...traitValidation.errors);
      }
    }

    // Validación contextual por plantilla
    if (templateId) {
      const templateValidation = this.validateByTemplate(templateId, trait);
      if (!templateValidation.isValid) {
        errors.push(...templateValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      sanitizedData: this.sanitizeData(data)
    };
  }

  // Validar campo individual
  validateField(fieldName, value, required = false) {
    const errors = [];
    const config = this.config[fieldName];

    if (!config) {
      errors.push(`Campo '${fieldName}' no reconocido`);
      return { isValid: false, errors };
    }

    // Verificar si es requerido
    if (required && (!value || value.trim().length === 0)) {
      errors.push(`${this.getFieldDisplayName(fieldName)} es requerido`);
      return { isValid: false, errors };
    }

    // Si no es requerido y está vacío, es válido
    if (!required && (!value || value.trim().length === 0)) {
      return { isValid: true, errors: [] };
    }

    const trimmedValue = value.trim();

    // Validar longitud mínima
    if (trimmedValue.length < config.minLength) {
      errors.push(`${this.getFieldDisplayName(fieldName)} debe tener al menos ${config.minLength} caracteres`);
    }

    // Validar longitud máxima
    if (trimmedValue.length > config.maxLength) {
      errors.push(`${this.getFieldDisplayName(fieldName)} no puede exceder ${config.maxLength} caracteres`);
    }

    // Validar patrón de caracteres permitidos
    if (!config.pattern.test(trimmedValue)) {
      errors.push(`${this.getFieldDisplayName(fieldName)} contiene caracteres no válidos. Solo se permiten letras y espacios`);
    }

    // Validar caracteres prohibidos
    if (config.forbiddenChars.test(trimmedValue)) {
      errors.push(`${this.getFieldDisplayName(fieldName)} contiene caracteres especiales no permitidos`);
    }

    // Validar palabras prohibidas
    const forbiddenWordFound = this.forbiddenWords.find(word => 
      trimmedValue.toLowerCase().includes(word.toLowerCase())
    );
    if (forbiddenWordFound) {
      errors.push(`${this.getFieldDisplayName(fieldName)} contiene palabras no apropiadas`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Validación específica por plantilla
  validateByTemplate(templateId, trait) {
    const errors = [];
    const requirements = this.templateRequirements[templateId];

    if (!requirements) {
      errors.push(`Plantilla '${templateId}' no reconocida`);
      return { isValid: false, errors };
    }

    // Verificar si la plantilla requiere característica
    if (requirements.requiresTrait && (!trait || trait.trim().length === 0)) {
      errors.push('Esta plantilla requiere una característica especial');
    }

    // Validar tipo de característica si se especifica
    if (requirements.traitType && trait) {
      const traitTypeValidation = this.validateTraitType(trait, requirements.traitType);
      if (!traitTypeValidation.isValid) {
        errors.push(...traitTypeValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Validar tipo de característica
  validateTraitType(trait, expectedType) {
    const errors = [];
    
    if (expectedType === 'positive') {
      // Lista de características positivas comunes
      const positiveTraits = [
        'alegre', 'trabajador', 'amable', 'generoso', 'inteligente', 
        'valiente', 'honesto', 'creativo', 'divertido', 'carismático',
        'responsable', 'leal', 'optimista', 'paciente', 'humilde'
      ];
      
      const isPositive = positiveTraits.some(positive => 
        trait.toLowerCase().includes(positive.toLowerCase())
      );
      
      if (!isPositive) {
        // No es error crítico, solo sugerencia
        // errors.push('Se recomienda usar una característica positiva para esta plantilla');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Sanitizar datos de entrada
  sanitizeData(data) {
    const sanitized = {};
    
    if (data.name) {
      sanitized.name = this.sanitizeString(data.name);
    }
    
    if (data.profession) {
      sanitized.profession = this.sanitizeString(data.profession);
    }
    
    if (data.trait) {
      sanitized.trait = this.sanitizeString(data.trait);
    }
    
    if (data.templateId) {
      sanitized.templateId = data.templateId.trim();
    }

    return sanitized;
  }

  // Sanitizar string individual
  sanitizeString(str) {
    if (!str || typeof str !== 'string') return '';
    
    return str
      .trim()                           // Eliminar espacios al inicio y final
      .replace(/\s+/g, ' ')            // Normalizar espacios múltiples
      .replace(/[<>]/g, '')            // Eliminar caracteres HTML básicos
      .substring(0, 100);              // Limitar longitud máxima de seguridad
  }

  // Obtener nombre de campo para mostrar
  getFieldDisplayName(fieldName) {
    const displayNames = {
      name: 'El nombre',
      profession: 'La profesión',
      trait: 'La característica'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Validación en tiempo real para frontend
  validateFieldRealTime(fieldName, value) {
    const validation = this.validateField(fieldName, value, false);
    return {
      isValid: validation.isValid,
      message: validation.errors.length > 0 ? validation.errors[0] : null
    };
  }

  // Obtener reglas de validación para el frontend
  getValidationRules() {
    return {
      name: {
        required: true,
        minLength: this.config.name.minLength,
        maxLength: this.config.name.maxLength,
        pattern: 'Solo letras y espacios'
      },
      profession: {
        required: true,
        minLength: this.config.profession.minLength,
        maxLength: this.config.profession.maxLength,
        pattern: 'Solo letras y espacios'
      },
      trait: {
        required: false,
        minLength: this.config.trait.minLength,
        maxLength: this.config.trait.maxLength,
        pattern: 'Solo letras y espacios'
      }
    };
  }
}

module.exports = { CalaveriteValidator };