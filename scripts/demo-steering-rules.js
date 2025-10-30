#!/usr/bin/env node

/**
 * Demo: Aplicación Automática de Steering Rules
 * 
 * Este script demuestra cómo las Steering Rules se aplican automáticamente
 * durante el desarrollo para mantener estándares de código y contenido.
 * 
 * Uso: node scripts/demo-steering-rules.js
 */

const fs = require('fs');
const path = require('path');

class SteeringRulesDemo {
  constructor() {
    this.rules = this.loadSteeringRules();
    this.violations = [];
    this.fixes = [];
  }

  loadSteeringRules() {
    console.log('📋 Cargando Steering Rules desde .kiro/steering/');
    
    // Simular carga de reglas (en producción se cargarían desde archivos .md)
    return {
      naming: {
        classes: 'PascalCase',
        functions: 'camelCase',
        variables: 'camelCase',
        constants: 'UPPER_SNAKE_CASE',
        files: 'kebab-case para CSS/HTML, camelCase para JS'
      },
      poetry: {
        syllables: '7-9 por verso (preferir octosílabos)',
        verses: '4-8 versos por calaverita',
        tone: 'humorístico, nunca ofensivo',
        cultural: 'referencias auténticas del Día de Muertos'
      },
      code: {
        errorHandling: 'usar try/catch en operaciones asíncronas',
        functions: 'pequeñas y con responsabilidad única',
        documentation: 'JSDoc para funciones públicas',
        variables: 'const por defecto, let cuando sea necesario'
      },
      structure: {
        organization: 'src/ para backend, public/ para frontend',
        imports: 'agrupar por tipo (externos, internos, relativos)',
        exports: 'usar module.exports o export default consistentemente'
      }
    };
  }

  async validateFile(filePath, content) {
    console.log(`\n🔍 Validando archivo: ${filePath}`);
    console.log('   Aplicando Steering Rules automáticamente...');
    
    const fileType = this.getFileType(filePath);
    const violations = [];
    const fixes = [];

    switch (fileType) {
      case 'javascript':
        const jsResults = this.validateJavaScript(content, filePath);
        violations.push(...jsResults.violations);
        fixes.push(...jsResults.fixes);
        break;
      
      case 'template':
        const templateResults = this.validateTemplate(content);
        violations.push(...templateResults.violations);
        fixes.push(...templateResults.fixes);
        break;
      
      case 'css':
        const cssResults = this.validateCSS(content);
        violations.push(...cssResults.violations);
        fixes.push(...cssResults.fixes);
        break;
    }

    return { violations, fixes, fileType };
  }

  validateJavaScript(content, filePath) {
    const violations = [];
    const fixes = [];

    console.log('   📝 Aplicando reglas de JavaScript...');

    // Regla: Naming conventions
    const classMatches = content.match(/class\s+([a-z][a-zA-Z]*)/g);
    if (classMatches) {
      classMatches.forEach(match => {
        const className = match.replace('class ', '');
        if (!/^[A-Z][a-zA-Z]*$/.test(className)) {
          violations.push(`Clase "${className}" debe usar PascalCase`);
          const fixed = className.charAt(0).toUpperCase() + className.slice(1);
          fixes.push(`Cambiar "${className}" → "${fixed}"`);
        }
      });
    }

    // Regla: Uso de var
    if (content.includes('var ')) {
      violations.push('Usar "const" o "let" en lugar de "var"');
      fixes.push('Reemplazar "var" con "const" (por defecto) o "let" (si se reasigna)');
    }

    // Regla: Manejo de errores
    const asyncFunctions = content.match(/async\s+function|async\s+\w+\s*=>/g);
    if (asyncFunctions && !content.includes('try') && !content.includes('catch')) {
      violations.push('Funciones async deben incluir manejo de errores try/catch');
      fixes.push('Agregar bloques try/catch para operaciones asíncronas');
    }

    // Regla: Funciones grandes
    const functions = content.match(/function\s+\w+[^}]*{[^}]*}/g) || [];
    functions.forEach(func => {
      const lines = func.split('\n').length;
      if (lines > 20) {
        violations.push('Función muy larga (>20 líneas), considerar dividir');
        fixes.push('Refactorizar en funciones más pequeñas con responsabilidad única');
      }
    });

    console.log(`   ✅ ${violations.length} violaciones encontradas`);
    
    return { violations, fixes };
  }

  validateTemplate(content) {
    const violations = [];
    const fixes = [];

    console.log('   🎭 Aplicando reglas de plantillas de calaveritas...');

    // Regla: Placeholders requeridos
    const requiredPlaceholders = ['{name}', '{profession}'];
    requiredPlaceholders.forEach(placeholder => {
      if (!content.includes(placeholder)) {
        violations.push(`Plantilla debe incluir ${placeholder}`);
        fixes.push(`Agregar ${placeholder} en posición apropiada`);
      }
    });

    // Regla: Número de versos
    const verses = content.split('\n').filter(line => line.trim());
    if (verses.length < 4 || verses.length > 8) {
      violations.push(`Plantilla tiene ${verses.length} versos, recomendado: 4-8`);
      fixes.push('Ajustar a 4-8 versos según tradición');
    }

    // Regla: Palabras culturales
    const culturalWords = ['catrina', 'panteón', 'ofrenda', 'difunto', 'finado', 'flaca bonita'];
    const hasCultural = culturalWords.some(word => content.toLowerCase().includes(word));
    if (!hasCultural) {
      violations.push('Plantilla debe incluir referencias culturales del Día de Muertos');
      fixes.push(`Agregar palabras como: ${culturalWords.slice(0, 3).join(', ')}`);
    }

    // Regla: Tono apropiado
    const inappropriateWords = ['violento', 'cruel', 'ofensivo', 'triste'];
    const hasInappropriate = inappropriateWords.some(word => content.toLowerCase().includes(word));
    if (hasInappropriate) {
      violations.push('Plantilla contiene palabras inapropiadas para el tono festivo');
      fixes.push('Reemplazar con vocabulario humorístico y festivo');
    }

    console.log(`   ✅ ${violations.length} violaciones encontradas`);
    
    return { violations, fixes };
  }

  validateCSS(content) {
    const violations = [];
    const fixes = [];

    console.log('   🎨 Aplicando reglas de CSS...');

    // Regla: Naming conventions
    const classNames = content.match(/\.([a-zA-Z][a-zA-Z0-9-_]*)/g) || [];
    classNames.forEach(className => {
      const name = className.substring(1);
      if (!/^[a-z][a-z0-9-]*$/.test(name)) {
        violations.push(`Clase CSS "${name}" debe usar kebab-case`);
        fixes.push(`Cambiar "${name}" a formato kebab-case`);
      }
    });

    // Regla: Responsividad
    if (!content.includes('@media')) {
      violations.push('CSS debe incluir media queries para responsividad');
      fixes.push('Agregar @media queries para móviles y desktop');
    }

    // Regla: Colores del tema
    const themeColors = ['#ff6b35', 'purple', 'green', 'orange'];
    const hasThemeColors = themeColors.some(color => content.includes(color));
    if (!hasThemeColors) {
      violations.push('CSS debe usar colores del tema Día de Muertos');
      fixes.push('Incorporar paleta temática: naranja, morado, verde');
    }

    console.log(`   ✅ ${violations.length} violaciones encontradas`);
    
    return { violations, fixes };
  }

  getFileType(filePath) {
    if (filePath.endsWith('.js')) return 'javascript';
    if (filePath.includes('template') || filePath.includes('generator.js')) return 'template';
    if (filePath.endsWith('.css')) return 'css';
    return 'unknown';
  }

  async applyAutoFixes(filePath, content, fixes) {
    console.log(`\n🔧 Aplicando correcciones automáticas a ${filePath}...`);
    
    let fixedContent = content;
    let appliedFixes = 0;

    // Simular aplicación de fixes automáticos
    fixes.forEach(fix => {
      if (fix.includes('var')) {
        fixedContent = fixedContent.replace(/var /g, 'const ');
        appliedFixes++;
        console.log(`   ✅ ${fix}`);
      }
      
      if (fix.includes('PascalCase')) {
        // Simular corrección de naming
        appliedFixes++;
        console.log(`   ✅ ${fix}`);
      }
      
      if (fix.includes('try/catch')) {
        // Simular adición de error handling
        console.log(`   ⚠️  ${fix} (requiere revisión manual)`);
      }
    });

    console.log(`   📊 ${appliedFixes}/${fixes.length} correcciones aplicadas automáticamente`);
    
    return { fixedContent, appliedFixes };
  }

  generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        filesChecked: results.length,
        totalViolations: results.reduce((sum, r) => sum + r.violations.length, 0),
        totalFixes: results.reduce((sum, r) => sum + r.fixes.length, 0),
        autoFixable: results.reduce((sum, r) => sum + r.autoFixable, 0)
      },
      details: results
    };

    return report;
  }
}

// Demo principal
async function runSteeringRulesDemo() {
  console.log('📋 DEMO: Aplicación Automática de Steering Rules\n');
  console.log('=' .repeat(60));
  
  const steering = new SteeringRulesDemo();
  
  // Archivos de ejemplo para validar
  const testFiles = [
    {
      path: 'src/generator.js',
      content: `var calaveriteGenerator = {
  generateCalaverita: async function(name, profession) {
    // Función sin manejo de errores
    const template = this.getRandomTemplate();
    return template.replace('{name}', name);
  }
};

class badClassName {
  constructor() {
    this.templates = [];
  }
}`
    },
    {
      path: 'src/templates/nueva-plantilla.txt',
      content: `Aquí yace {name}
que trabajaba mucho
y ahora descansa en paz
sin más preocupaciones.`
    },
    {
      path: 'public/styles.css',
      content: `.MainContainer {
  background: blue;
  color: red;
}

.another_bad_name {
  font-size: 16px;
}`
    }
  ];

  const results = [];

  try {
    console.log('\n🚀 Ejecutando validación con Steering Rules...\n');
    
    for (const file of testFiles) {
      const validation = await steering.validateFile(file.path, file.content);
      
      // Simular aplicación de auto-fixes
      const autoFix = await steering.applyAutoFixes(file.path, file.content, validation.fixes);
      
      results.push({
        filePath: file.path,
        fileType: validation.fileType,
        violations: validation.violations,
        fixes: validation.fixes,
        autoFixable: autoFix.appliedFixes
      });
      
      console.log();
    }
    
    // Generar reporte final
    console.log('=' .repeat(60));
    console.log('📊 REPORTE DE STEERING RULES');
    console.log('=' .repeat(60));
    
    const report = steering.generateReport(results);
    
    console.log(`Archivos revisados: ${report.summary.filesChecked}`);
    console.log(`Total violaciones: ${report.summary.totalViolations}`);
    console.log(`Correcciones disponibles: ${report.summary.totalFixes}`);
    console.log(`Auto-corregibles: ${report.summary.autoFixable}`);
    
    const complianceRate = ((report.summary.totalFixes - report.summary.totalViolations) / report.summary.totalFixes * 100) || 0;
    console.log(`Tasa de cumplimiento: ${Math.max(0, complianceRate).toFixed(1)}%`);
    
    // Mostrar detalles por archivo
    console.log('\n📁 Detalles por archivo:');
    results.forEach(result => {
      console.log(`\n   ${result.filePath} (${result.fileType}):`);
      console.log(`   - Violaciones: ${result.violations.length}`);
      console.log(`   - Auto-fixes: ${result.autoFixable}`);
      
      if (result.violations.length > 0) {
        console.log('   - Principales issues:');
        result.violations.slice(0, 2).forEach(violation => {
          console.log(`     • ${violation}`);
        });
      }
    });
    
    // Guardar reporte
    const reportPath = 'data/steering-rules-report.json';
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data', { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Reporte completo guardado en: ${reportPath}`);
    
    console.log('\n🎯 Beneficios de Steering Rules:');
    console.log('   ✅ Aplicación automática de estándares');
    console.log('   ✅ Corrección inmediata de issues comunes');
    console.log('   ✅ Consistencia en todo el proyecto');
    console.log('   ✅ Reducción de tiempo en code reviews');
    
  } catch (error) {
    console.error('❌ Error durante demo de Steering Rules:', error.message);
  }
  
  console.log('\n🎉 Demo completado. En producción, estas reglas se aplicarían automáticamente al editar archivos.');
}

// Ejecutar demo si se llama directamente
if (require.main === module) {
  runSteeringRulesDemo().catch(console.error);
}

module.exports = { SteeringRulesDemo, runSteeringRulesDemo };