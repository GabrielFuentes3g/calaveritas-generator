class CalaveriteGenerator {
  constructor() {
    this.templates = [
      {
        pattern: "Aquí yace {name}, {profession} querido,\nque por {trait} era conocido.\nLa muerte lo vino a buscar,\ny no se pudo escapar.\n¡Descanse en paz, ha partido!",
        requiresTrait: true
      },
      {
        pattern: "La flaca bonita llegó por {name},\n{profession} de gran fama.\nCon su guadaña filosa,\nse lo llevó de manera graciosa.\n¡Adiós {name}, que en paz descanses!",
        requiresTrait: false
      },
      {
        pattern: "{name} el {profession} trabajador,\nsiempre fue de buen humor.\nPero la muerte traviesa,\nle jugó una mala pieza.\n¡Ya no habrá más diversión!",
        requiresTrait: false
      },
      {
        pattern: "Don {name}, {profession} respetado,\npor {trait} era admirado.\nLa catrina lo invitó,\na su baile lo llevó.\n¡Que baile por la eternidad!",
        requiresTrait: true
      },
      {
        pattern: "Había una vez {name},\n{profession} de buena gana.\nLa muerte le hizo una seña,\ny se fue sin dar pena.\n¡Que descanse en la montaña!",
        requiresTrait: false
      }
    ];
  }

  generate(name, profession, trait = null) {
    // Filtrar templates según si tenemos trait o no
    const availableTemplates = this.templates.filter(template => 
      !template.requiresTrait || (template.requiresTrait && trait)
    );

    // Seleccionar template aleatorio
    const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    
    // Reemplazar placeholders
    let text = template.pattern
      .replace(/{name}/g, name)
      .replace(/{profession}/g, profession);
    
    if (trait && template.requiresTrait) {
      text = text.replace(/{trait}/g, trait);
    }

    return {
      id: Date.now().toString(),
      name,
      profession,
      trait,
      text,
      date: new Date().toLocaleDateString('es-MX')
    };
  }
}

module.exports = { CalaveriteGenerator };