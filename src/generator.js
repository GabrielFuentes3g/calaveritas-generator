class CalaveriteGenerator {
  constructor() {
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

  generate(name, profession, trait = null) {
    return this.generateWithTemplate(name, profession, trait);
  }

  generateWithTemplate(name, profession, trait = null, templateId = null) {
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

    return {
      id: Date.now().toString(),
      name,
      profession,
      trait,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      text,
      date: new Date().toLocaleDateString('es-MX')
    };
  }
}

module.exports = { CalaveriteGenerator };
