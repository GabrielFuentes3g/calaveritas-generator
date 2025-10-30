/**
 * MCP Integration Module
 * Integrates Model Context Protocol tools for enhanced calaverita development
 */

class MCPIntegration {
  constructor() {
    this.mcpEnabled = this.checkMCPAvailability();
    this.validationRules = {
      cultural: {
        requiredElements: ['muerte', 'catrina', 'descansar', 'descanses', 'paz', 'eternidad', 'baile', 'guadaña'],
        culturalConcepts: ['flaca bonita', 'don', 'doña', 'querido', 'querida', 'respetado', 'respetada'],
        forbiddenElements: ['violencia', 'tristeza', 'dolor'],
        toneKeywords: ['humor', 'gracia', 'tradición', 'respeto', 'graciosa', 'diversión', 'celebración']
      },
      poetic: {
        minLines: 4,
        maxLines: 6,
        rhymeScheme: ['ABAB', 'AABB', 'ABCB'],
        syllableCount: [8, 11] // Octosílabos o endecasílabos tradicionales
      }
    };
  }

  /**
   * Check if MCP tools are available
   */
  checkMCPAvailability() {
    // In a real implementation, this would check if MCP server is running
    // For now, we'll simulate the availability
    return process.env.MCP_ENABLED !== 'false';
  }

  /**
   * Validate a new template using MCP cultural_check tool
   */
  async validateTemplate(template) {
    if (!this.mcpEnabled) {
      return this.fallbackValidation(template);
    }

    try {
      // Simulate MCP cultural_check tool call
      const culturalValidation = await this.simulateMCPCall('cultural_check', {
        text: template.pattern,
        context: 'día_de_muertos',
        tone: 'humorístico_respetuoso'
      });

      const poeticValidation = await this.simulateMCPCall('validate_poem', {
        text: template.pattern,
        style: 'calaverita_tradicional',
        metrics: this.validationRules.poetic
      });

      return {
        isValid: culturalValidation.isValid && poeticValidation.isValid,
        culturalScore: culturalValidation.score,
        poeticScore: poeticValidation.score,
        suggestions: [
          ...culturalValidation.suggestions,
          ...poeticValidation.suggestions
        ],
        mcpUsed: true
      };
    } catch (error) {
      console.warn('MCP validation failed, using fallback:', error.message);
      return this.fallbackValidation(template);
    }
  }

  /**
   * Generate a new template using MCP generate_template tool
   */
  async generateTemplate(theme, style = 'tradicional') {
    if (!this.mcpEnabled) {
      return this.fallbackGeneration(theme, style);
    }

    try {
      // Simulate MCP generate_template tool call
      const generated = await this.simulateMCPCall('generate_template', {
        theme: theme,
        style: style,
        cultural_context: 'día_de_muertos_mexicano',
        tone: 'humorístico_tradicional',
        structure: 'calaverita_clásica'
      });

      return {
        id: `mcp_${Date.now()}`,
        name: generated.name,
        pattern: generated.pattern,
        requiresTrait: generated.requiresTrait,
        description: generated.description,
        mcpGenerated: true,
        culturalScore: generated.culturalScore,
        poeticScore: generated.poeticScore
      };
    } catch (error) {
      console.warn('MCP generation failed, using fallback:', error.message);
      return this.fallbackGeneration(theme, style);
    }
  }

  /**
   * Enhanced validation workflow: MCP → validation → integration
   */
  async enhancedValidationWorkflow(template) {
    console.log('🎭 Iniciando flujo de validación mejorado con MCP...');
    
    // Step 1: MCP Validation
    const validation = await this.validateTemplate(template);
    console.log(`📊 Validación cultural: ${validation.culturalScore}/100`);
    console.log(`🎵 Validación poética: ${validation.poeticScore}/100`);

    // Step 2: Apply suggestions if needed
    if (validation.suggestions.length > 0) {
      console.log('💡 Sugerencias de mejora:');
      validation.suggestions.forEach((suggestion, index) => {
        console.log(`   ${index + 1}. ${suggestion}`);
      });
    }

    // Step 3: Integration decision
    const shouldIntegrate = validation.isValid && 
                           validation.culturalScore >= 70 && 
                           validation.poeticScore >= 60;

    return {
      ...validation,
      shouldIntegrate,
      integrationReady: shouldIntegrate,
      workflow: 'MCP → validación → integración'
    };
  }

  /**
   * Simulate MCP tool calls (in real implementation, this would call actual MCP tools)
   */
  async simulateMCPCall(tool, params) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    switch (tool) {
      case 'cultural_check':
        return this.simulateCulturalCheck(params);
      case 'validate_poem':
        return this.simulatePoetryValidation(params);
      case 'generate_template':
        return this.simulateTemplateGeneration(params);
      default:
        throw new Error(`Unknown MCP tool: ${tool}`);
    }
  }

  /**
   * Simulate cultural validation
   */
  simulateCulturalCheck(params) {
    const text = params.text.toLowerCase();
    let score = 70; // Base score for Mexican Day of the Dead context
    const suggestions = [];

    // Core Day of the Dead elements (high value)
    const coreElements = {
      'muerte': 8, 'catrina': 10, 'descansar': 6, 'descanses': 6, 'paz': 7,
      'eternidad': 8, 'baile': 5, 'guadaña': 7, 'flaca bonita': 12
    };
    
    Object.keys(coreElements).forEach(element => {
      if (text.includes(element)) {
        score += coreElements[element];
      }
    });

    // Traditional respectful forms (cultural authenticity)
    const respectfulForms = {
      'don ': 8, 'doña ': 8, 'querido': 5, 'querida': 5, 
      'respetado': 6, 'respetada': 6, 'admirado': 4, 'admirada': 4
    };
    
    Object.keys(respectfulForms).forEach(form => {
      if (text.includes(form)) {
        score += respectfulForms[form];
      }
    });

    // Traditional openings (structural authenticity)
    const traditionalOpenings = {
      'aquí yace': 10, 'había una vez': 8, 'en vida': 6,
      'como flor que se marchita': 12
    };
    
    Object.keys(traditionalOpenings).forEach(opening => {
      if (text.includes(opening)) {
        score += traditionalOpenings[opening];
      }
    });

    // Tone and mood indicators
    const toneIndicators = {
      'graciosa': 8, 'diversión': 7, 'celebración': 9, 'humor': 6,
      'bromista': 8, 'optimista': 6, 'traviesa': 5, 'gracia': 7
    };
    
    Object.keys(toneIndicators).forEach(indicator => {
      if (text.includes(indicator)) {
        score += toneIndicators[indicator];
      }
    });

    // Poetic endings (traditional closures)
    const poeticEndings = {
      'que en paz descanses': 10, 'descanse en paz': 8, 'ha partido': 6,
      'que baile por la eternidad': 12, 'que descanse en la montaña': 8,
      'que siga la celebración': 10, 'su recuerdo nos visita': 9
    };
    
    Object.keys(poeticEndings).forEach(ending => {
      if (text.includes(ending)) {
        score += poeticEndings[ending];
      }
    });

    // Check for forbidden elements (penalties)
    this.validationRules.cultural.forbiddenElements.forEach(element => {
      if (text.includes(element)) {
        score -= 25;
        suggestions.push(`Evitar referencias a "${element}" para mantener el tono apropiado del Día de Muertos`);
      }
    });

    // Penalty for modern/inappropriate language
    const inappropriateTerms = ['ok', 'cool', 'wow', 'super', 'genial'];
    inappropriateTerms.forEach(term => {
      if (text.includes(term)) {
        score -= 10;
        suggestions.push('Usar vocabulario tradicional mexicano en lugar de términos modernos');
      }
    });

    // Bonus for gender concordance (detected through patterns)
    if ((text.includes('don ') && text.includes('respetado')) || 
        (text.includes('doña ') && text.includes('respetada'))) {
      score += 8;
    }

    return {
      isValid: score >= 75,
      score: Math.min(100, Math.max(40, score)),
      suggestions: suggestions.slice(0, 3)
    };
  }

  /**
   * Simulate poetry validation
   */
  simulatePoetryValidation(params) {
    const lines = params.text.split('\n').filter(line => line.trim());
    let score = 50;
    const suggestions = [];

    // Check line count
    if (lines.length >= this.validationRules.poetic.minLines && 
        lines.length <= this.validationRules.poetic.maxLines) {
      score += 20;
    } else {
      suggestions.push(`Ajustar a ${this.validationRules.poetic.minLines}-${this.validationRules.poetic.maxLines} líneas`);
    }

    // Simple rhyme check (basic simulation)
    if (lines.length >= 4) {
      const lastWords = lines.map(line => line.trim().split(' ').pop().toLowerCase());
      if (this.hasBasicRhyme(lastWords)) {
        score += 20;
      } else {
        suggestions.push('Mejorar la rima entre versos');
      }
    }

    // Check for traditional structure
    if (params.text.includes('{name}') && params.text.includes('{profession}')) {
      score += 10;
    }

    return {
      isValid: score >= 60,
      score: Math.min(100, Math.max(0, score)),
      suggestions: suggestions.slice(0, 2)
    };
  }

  /**
   * Simulate template generation
   */
  simulateTemplateGeneration(params) {
    const themes = {
      'artista': {
        name: 'El Artista',
        pattern: "{name} el {profession} creativo,\ncon su arte tan expresivo.\nLa muerte admiró su obra,\ny su alma ahora se cobra.\n¡Arte eterno, qué motivo!",
        requiresTrait: false,
        description: "Celebra la creatividad y expresión artística"
      },
      'cocinero': {
        name: 'El Cocinero',
        pattern: "{name} cocinaba con {trait},\n{profession} de gran donaire.\nLa catrina probó su sazón,\ny se lo llevó de ocasión.\n¡Buen provecho en el más allá!",
        requiresTrait: true,
        description: "Honra las habilidades culinarias y el buen sazón"
      }
    };

    const theme = themes[params.theme] || themes['artista'];
    
    return {
      ...theme,
      culturalScore: 85,
      poeticScore: 78,
      mcpGenerated: true,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Basic rhyme detection (simplified)
   */
  hasBasicRhyme(words) {
    if (words.length < 4) return false;
    
    // Check ABAB pattern
    const ending1 = words[0].slice(-2);
    const ending2 = words[1].slice(-2);
    const ending3 = words[2].slice(-2);
    const ending4 = words[3].slice(-2);
    
    return (ending1 === ending3 && ending2 === ending4) || // ABAB
           (ending1 === ending2 && ending3 === ending4);   // AABB
  }

  /**
   * Fallback validation when MCP is not available
   */
  fallbackValidation(template) {
    console.log('⚠️  MCP no disponible, usando validación básica...');
    
    return {
      isValid: true,
      culturalScore: 75,
      poeticScore: 70,
      suggestions: ['Considera instalar herramientas MCP para validación avanzada'],
      mcpUsed: false
    };
  }

  /**
   * Fallback generation when MCP is not available
   */
  fallbackGeneration(theme, style) {
    console.log('⚠️  MCP no disponible, usando generación básica...');
    
    return {
      id: `fallback_${Date.now()}`,
      name: 'Plantilla Básica',
      pattern: "{name} el {profession} querido,\nsiempre fue muy divertido.\nLa muerte lo fue a buscar,\ny no se pudo escapar.\n¡Descanse en paz, ha partido!",
      requiresTrait: false,
      description: "Plantilla generada con método básico",
      mcpGenerated: false,
      culturalScore: 70,
      poeticScore: 65
    };
  }

  /**
   * Get MCP integration status and benefits
   */
  getIntegrationStatus() {
    return {
      mcpEnabled: this.mcpEnabled,
      availableTools: ['generate_template', 'validate_poem', 'cultural_check'],
      benefits: [
        'Validación automática de contenido cultural',
        'Generación asistida con contexto tradicional',
        'Métricas poéticas de calidad profesional',
        'Flujo de desarrollo mejorado y automatizado'
      ],
      workflow: 'MCP → validación → integración'
    };
  }
}

module.exports = { MCPIntegration };