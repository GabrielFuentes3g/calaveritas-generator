const { MCPIntegration } = require('./mcp-integration');

class CalaveriteGenerator {
  constructor() {
    this.mcpIntegration = new MCPIntegration();
    this.templates = [
      {
        id: 'clasica',
        name: 'Clásica Tradicional',
        pattern: "Aquí yace {name}, {profession} {querido},\nque por {trait} era {conocido}.\nLa muerte {lo} vino a buscar,\ny no se pudo escapar.\n¡Descanse en paz, ha partido!",
        requiresTrait: true,
        description: "Estilo tradicional mexicano que resalta una característica especial de la persona"
      },
      {
        id: 'catrina',
        name: 'La Elegante Catrina',
        pattern: "La flaca bonita llegó por {name},\n{profession} de gran fama.\nCon su guadaña filosa,\n{se_lo} llevó de manera graciosa.\n¡Adiós {name}, que en paz descanses!",
        requiresTrait: false,
        description: "Invoca a la elegante Catrina para llevarse al personaje con gracia y estilo"
      },
      {
        id: 'trabajador',
        name: 'El Gran Trabajador',
        pattern: "{name} {el} {profession} {trabajador},\nsiempre fue de buen humor.\nPero la muerte traviesa,\nle jugó una mala pieza.\n¡Ya no habrá más diversión!",
        requiresTrait: false,
        description: "Celebra la dedicación laboral y el buen humor del personaje"
      },
      {
        id: 'respetado',
        name: 'El Muy Respetado',
        pattern: "{don} {name}, {profession} {respetado},\npor {trait} era {admirado}.\nLa catrina {lo} invitó,\na su baile {lo} llevó.\n¡Que baile por la eternidad!",
        requiresTrait: true,
        description: "Honra a personas respetadas destacando su cualidad más admirada"
      },
      {
        id: 'festivo',
        name: 'El Festivo',
        pattern: "En vida {name} fue {profession},\nsiempre con gran diversión.\nPor {trait} {lo} recordamos,\ny con cariño {lo} extrañamos.\n¡Que siga la celebración!",
        requiresTrait: true,
        description: "Estilo alegre que celebra la vida y las cualidades de la persona"
      },
      {
        id: 'poetico',
        name: 'El Poético',
        pattern: "Como flor que se marchita,\nse fue {name} {el} {profession}.\nSu {trait} nos ilumina,\nen esta noche divina.\n¡Su recuerdo nos visita!",
        requiresTrait: true,
        description: "Estilo poético con metáforas florales y tono melancólico pero hermoso"
      },
      {
        id: 'humoristico',
        name: 'El Humorístico',
        pattern: "{name} {el} {profession} bromista,\nsiempre fue muy optimista.\nLa muerte le dijo 'ven',\ny {el} respondió '¡está bien!'\n¡Qué {trait} tan realista!",
        requiresTrait: true,
        description: "Estilo divertido que usa el humor típico de las calaveritas mexicanas"
      },
      {
        id: 'nostalgico',
        name: 'El Nostálgico',
        pattern: "Había una vez {name},\n{profession} de buena gana.\nLa muerte le hizo una seña,\ny se fue sin dar pena.\n¡Que descanse en la montaña!",
        requiresTrait: false,
        description: "Estilo narrativo nostálgico que cuenta la historia como un cuento tradicional"
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

    // Detectar género basado en el nombre y profesión
    const gender = this.detectGender(name, profession);
    
    // Reemplazar placeholders básicos
    let text = selectedTemplate.pattern
      .replace(/{name}/g, name)
      .replace(/{profession}/g, profession);
    
    if (trait && selectedTemplate.requiresTrait) {
      text = text.replace(/{trait}/g, trait);
    }

    // Aplicar concordancia de género
    text = this.applyGenderConcordance(text, gender);

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
        version: '2.0',
        detectedGender: gender
      }
    };
  }

  // Calcular número de palabras en el texto
  calculateWordCount(text) {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  // Detectar género basado en nombre y profesión
  detectGender(name, profession) {
    const nameLower = name.toLowerCase();
    const professionLower = profession.toLowerCase();
    
    // Nombres típicamente femeninos
    const femaleNames = [
      'maria', 'ana', 'carmen', 'rosa', 'elena', 'laura', 'patricia', 'sofia', 'lucia', 'isabel',
      'cristina', 'marta', 'pilar', 'teresa', 'angeles', 'dolores', 'mercedes', 'francisca',
      'antonia', 'paula', 'sara', 'raquel', 'monica', 'silvia', 'beatriz', 'nuria', 'rocio',
      'amparo', 'gloria', 'esperanza', 'consuelo', 'remedios', 'encarnacion', 'josefa', 'juana',
      'guadalupe', 'lupe', 'marisol', 'rosario', 'soledad', 'victoria', 'alejandra', 'andrea',
      'claudia', 'diana', 'gabriela', 'natalia', 'valeria', 'daniela', 'carolina', 'fernanda'
    ];
    
    // Nombres típicamente masculinos
    const maleNames = [
      'jose', 'antonio', 'manuel', 'francisco', 'david', 'juan', 'javier', 'daniel', 'carlos',
      'miguel', 'alejandro', 'rafael', 'pedro', 'angel', 'sergio', 'alberto', 'fernando',
      'pablo', 'jorge', 'luis', 'jesus', 'marcos', 'adrian', 'diego', 'alvaro', 'ivan',
      'ruben', 'oscar', 'victor', 'eduardo', 'roberto', 'mario', 'ricardo', 'andres',
      'raul', 'enrique', 'ramon', 'vicente', 'ignacio', 'lorenzo', 'cristian', 'gabriel',
      'santiago', 'sebastian', 'nicolas', 'mateo', 'lucas', 'martin', 'hugo', 'gonzalo'
    ];
    
    // Profesiones típicamente femeninas
    const femaleProfessions = [
      'doctora', 'medica', 'enfermera', 'maestra', 'profesora', 'ingeniera', 'abogada',
      'contadora', 'programadora', 'arquitecta', 'periodista', 'escritora', 'artista',
      'musica', 'cocinera', 'chef', 'secretaria', 'recepcionista', 'vendedora',
      'cajera', 'limpiadora', 'costurera', 'peluquera', 'esteticista', 'psicologa',
      'trabajadora social', 'bibliotecaria', 'farmaceutica', 'veterinaria', 'dentista'
    ];
    
    // Profesiones típicamente masculinas
    const maleProfessions = [
      'doctor', 'medico', 'enfermero', 'maestro', 'profesor', 'ingeniero', 'abogado',
      'contador', 'programador', 'arquitecto', 'periodista', 'escritor', 'artista',
      'musico', 'cocinero', 'chef', 'secretario', 'recepcionista', 'vendedor',
      'cajero', 'limpiador', 'costurero', 'peluquero', 'psicologo', 'trabajador social',
      'bibliotecario', 'farmaceutico', 'veterinario', 'dentista', 'mecanico', 'electricista',
      'plomero', 'carpintero', 'albañil', 'soldador', 'chofer', 'taxista', 'policia',
      'bombero', 'soldado', 'guardia', 'conserje', 'jardinero'
    ];
    
    // Verificar por nombre
    if (femaleNames.some(fn => nameLower.includes(fn))) {
      return 'female';
    }
    if (maleNames.some(mn => nameLower.includes(mn))) {
      return 'male';
    }
    
    // Verificar por profesión
    if (femaleProfessions.some(fp => professionLower.includes(fp))) {
      return 'female';
    }
    if (maleProfessions.some(mp => professionLower.includes(mp))) {
      return 'male';
    }
    
    // Terminaciones típicas femeninas en nombres
    if (nameLower.endsWith('a') || nameLower.endsWith('ia') || nameLower.endsWith('ina') || 
        nameLower.endsWith('ela') || nameLower.endsWith('isa') || nameLower.endsWith('ez')) {
      return 'female';
    }
    
    // Terminaciones típicas masculinas en nombres
    if (nameLower.endsWith('o') || nameLower.endsWith('or') || nameLower.endsWith('an') || 
        nameLower.endsWith('el') || nameLower.endsWith('os')) {
      return 'male';
    }
    
    // Por defecto, asumir masculino (tradición de las calaveritas)
    return 'male';
  }

  // Aplicar concordancia de género al texto
  applyGenderConcordance(text, gender) {
    const isFemale = gender === 'female';
    
    // Reemplazos para concordancia de género
    const replacements = {
      // Artículos y pronombres
      '{el}': isFemale ? 'la' : 'el',
      '{lo}': isFemale ? 'la' : 'lo',
      '{se_lo}': isFemale ? 'se la' : 'se lo',
      
      // Tratamientos de respeto
      '{don}': isFemale ? 'Doña' : 'Don',
      
      // Adjetivos comunes
      '{querido}': isFemale ? 'querida' : 'querido',
      '{conocido}': isFemale ? 'conocida' : 'conocido',
      '{respetado}': isFemale ? 'respetada' : 'respetado',
      '{admirado}': isFemale ? 'admirada' : 'admirado',
      '{trabajador}': isFemale ? 'trabajadora' : 'trabajador',
      '{estimado}': isFemale ? 'estimada' : 'estimado',
      '{recordado}': isFemale ? 'recordada' : 'recordado',
      '{amado}': isFemale ? 'amada' : 'amado',
      '{honrado}': isFemale ? 'honrada' : 'honrado',
      '{celebrado}': isFemale ? 'celebrada' : 'celebrado'
    };
    
    // Aplicar todos los reemplazos
    Object.keys(replacements).forEach(placeholder => {
      text = text.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), replacements[placeholder]);
    });
    
    return text;
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
