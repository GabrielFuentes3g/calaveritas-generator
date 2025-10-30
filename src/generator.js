const { MCPIntegration } = require('./mcp-integration');

class CalaveriteGenerator {
  constructor() {
    this.mcpIntegration = new MCPIntegration();
    this.templates = [
      {
        id: 'clasica',
        name: 'Clásica',
        pattern: "Aquí yace {name}, {profession} querido,\nque por {trait} era conocido.\nLa muerte lo vino a buscar,\ny no se pudo escapar.\n¡Descanse en paz, ha partido!",
        requiresTrait: true,
        description: "Estilo tradicional que resalta una característica especial de la persona"
      },
      {
        id: 'catrina',
        name: 'La Catrina',
        pattern: "La flaca bonita llegó por {name},\n{profession} de gran fama.\nCon su guadaña filosa,\nse lo llevó de manera graciosa.\n¡Adiós {name}, que en paz descanses!",
        requiresTrait: false,
        description: "Invoca a la elegante Catrina para llevarse al personaje con gracia"
      },
      {
        id: 'trabajador',
        name: 'El Trabajador',
        pattern: "{name} el {profession} trabajador,\nsiempre fue de buen humor.\nPero la muerte traviesa,\nle jugó una mala pieza.\n¡Ya no habrá más diversión!",
        requiresTrait: false,
        description: "Celebra la dedicación laboral y el buen humor del personaje"
      },
      {
        id: 'respetado',
        name: 'El Respetado',
        pattern: "Don {name}, {profession} respetado,\npor {trait} era admirado.\nLa catrina lo invitó,\na su baile lo llevó.\n¡Que baile por la eternidad!",
        requiresTrait: true,
        description: "Honra a personas respetadas destacando su cualidad más admirada"
      },
      {
        id: 'montaña',
        name: 'De la Montaña',
        pattern: "Había una vez {name},\n{profession} de buena gana.\nLa muerte le hizo una seña,\ny se fue sin dar pena.\n¡Que descanse en la montaña!",
        requiresTrait: false,
        description: "Estilo narrativo que cuenta la historia como un cuento tradicional"
      }
    ];
  }

  getTemplates() {
    return this.templates.map(template => ({
      id: template.id,
      name: template.name,
      requiresTrait: template.requiresTrait,
      description: template.description
    }));
  }

  generate(name, profession, trait = null, userAgent = 'server') {
    return this.generateWithTemplate(name, profession, trait, null, userAgent);
  }

  generateWithTemplate(name, profession, trait = null, templateId = null, userAgent = 'server') {
    const startTime = Date.now();
    let selectedTemplate;
    
    if (templateId) {
      selectedTemplate = this.templates.find(t => t.id === templateId);
      if (!selectedTemplate) {
        throw new Error('Template no encontrado');
      }
      if (selectedTemplate.requiresTrait && !trait) {
        throw new Error('Esta plantilla requiere una característica especial');
      }
    } else {
      // Lógica original de selección aleatoria
      const availableTemplates = this.templates.filter(template => 
        !template.requiresTrait || (template.requiresTrait && trait)
      );
      selectedTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    }

    // Reemplazar placeholders
    let text = selectedTemplate.pattern
      .replace(/{name}/g, name)
      .replace(/{profession}/g, profession);
    
    if (trait && selectedTemplate.requiresTrait) {
      text = text.replace(/{trait}/g, trait);
    }

    const generationTime = Date.now() - startTime;

    return {
      id: Date.now().toString(),
      name,
      profession,
      trait,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      text,
      date: new Date().toLocaleDateString('es-MX'),
      metadata: {
        wordCount: this.calculateWordCount(text),
        generationTime: generationTime,
        userAgent: userAgent,
        createdAt: new Date().toISOString(),
        version: '2.0'
      }
    };
  }

  // Calcular número de palabras en el texto
  calculateWordCount(text) {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * MCP-Enhanced Methods for Development Workflow
   */

  // Validate a template using MCP tools
  async validateTemplateWithMCP(template) {
    console.log(`🎭 Validando plantilla "${template.name}" con herramientas MCP...`);
    return await this.mcpIntegration.enhancedValidationWorkflow(template);
  }

  // Generate new template using MCP assistance
  async generateTemplateWithMCP(theme, style = 'tradicional') {
    console.log(`🎨 Generando nueva plantilla con tema "${theme}" usando MCP...`);
    const newTemplate = await this.mcpIntegration.generateTemplate(theme, style);
    
    if (newTemplate.mcpGenerated) {
      console.log(`✨ Plantilla generada exitosamente con MCP`);
      console.log(`📊 Puntuación cultural: ${newTemplate.culturalScore}/100`);
      console.log(`🎵 Puntuación poética: ${newTemplate.poeticScore}/100`);
    }
    
    return newTemplate;
  }

  // Add new template with MCP validation
  async addTemplateWithValidation(template) {
    console.log('🔍 Iniciando proceso de validación e integración...');
    
    // Step 1: MCP Validation
    const validation = await this.validateTemplateWithMCP(template);
    
    // Step 2: Integration decision
    if (validation.shouldIntegrate) {
      this.templates.push({
        ...template,
        validated: true,
        validationScore: {
          cultural: validation.culturalScore,
          poetic: validation.poeticScore
        },
        addedAt: new Date().toISOString()
      });
      
      console.log(`✅ Plantilla "${template.name}" integrada exitosamente`);
      return { success: true, template, validation };
    } else {
      console.log(`❌ Plantilla "${template.name}" no cumple los criterios de calidad`);
      return { success: false, template, validation };
    }
  }

  // Get MCP integration status
  getMCPStatus() {
    return this.mcpIntegration.getIntegrationStatus();
  }

  // Enhanced generation with MCP context
  async generateWithMCPContext(name, profession, trait = null, templateId = null) {
    console.log('🎭 Generando calaverita con contexto MCP mejorado...');
    
    // Use standard generation
    const calaverita = this.generateWithTemplate(name, profession, trait, templateId);
    
    // Add MCP validation to the generated content
    if (this.mcpIntegration.mcpEnabled) {
      const validation = await this.mcpIntegration.validateTemplate({
        pattern: calaverita.text,
        name: 'Generated Content'
      });
      
      calaverita.metadata.mcpValidation = {
        culturalScore: validation.culturalScore,
        poeticScore: validation.poeticScore,
        suggestions: validation.suggestions
      };
    }
    
    return calaverita;
  }
}

module.exports = { CalaveriteGenerator };
