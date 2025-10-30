#!/usr/bin/env node

/**
 * Demo: MCP Validation of New Template
 * 
 * Este script demuestra cómo usar las herramientas MCP para validar
 * una nueva plantilla de calaverita en tiempo real.
 * 
 * Uso: node scripts/demo-mcp-validation.js
 */

const fs = require('fs');
const path = require('path');

// Simulación de herramientas MCP (en producción se conectarían al servidor real)
class MCPToolsDemo {
  constructor() {
    this.tools = {
      validate_poem: this.validatePoem.bind(this),
      cultural_check: this.culturalCheck.bind(this),
      analyze_metrics: this.analyzeMetrics.bind(this),
      suggest_improvements: this.suggestImprovements.bind(this)
    };
  }

  async validatePoem(template) {
    console.log('🔍 MCP Tool: validate_poem');
    console.log('   Validando estructura poética...');
    
    // Simular validación de métricas poéticas
    const verses = template.split('\n').filter(line => line.trim());
    const syllableCounts = verses.map(verse => this.countSyllables(verse));
    
    const results = {
      isValid: syllableCounts.every(count => count >= 7 && count <= 9),
      syllableCounts,
      expectedRange: '7-9 sílabas por verso',
      recommendation: syllableCounts.every(count => count >= 7 && count <= 9) 
        ? 'Métrica correcta ✅' 
        : 'Ajustar a octosílabos (8 sílabas) ⚠️'
    };

    console.log(`   Resultado: ${results.recommendation}`);
    console.log(`   Sílabas por verso: ${syllableCounts.join(', ')}`);
    
    return results;
  }

  async culturalCheck(template) {
    console.log('🎭 MCP Tool: cultural_check');
    console.log('   Verificando autenticidad cultural...');
    
    // Palabras y frases culturalmente apropiadas
    const culturalMarkers = [
      'día de muertos', 'catrina', 'ofrenda', 'panteón', 'flaca bonita',
      'calaverita', 'difunto', 'finado', 'descansar', 'eternidad'
    ];
    
    const foundMarkers = culturalMarkers.filter(marker => 
      template.toLowerCase().includes(marker.toLowerCase())
    );
    
    const results = {
      culturalScore: Math.min(100, (foundMarkers.length / culturalMarkers.length) * 100 + 50),
      foundMarkers,
      missingElements: foundMarkers.length < 2 ? 'Agregar más referencias culturales' : null,
      toneCheck: this.checkTone(template)
    };

    console.log(`   Puntuación cultural: ${results.culturalScore.toFixed(1)}%`);
    console.log(`   Referencias encontradas: ${foundMarkers.join(', ') || 'Ninguna'}`);
    console.log(`   Tono: ${results.toneCheck}`);
    
    return results;
  }

  async analyzeMetrics(template) {
    console.log('📊 MCP Tool: analyze_metrics');
    console.log('   Analizando métricas poéticas avanzadas...');
    
    const verses = template.split('\n').filter(line => line.trim());
    const rhymePattern = this.analyzeRhyme(verses);
    const rhythm = this.analyzeRhythm(template);
    
    const results = {
      verseCount: verses.length,
      rhymePattern,
      rhythm,
      traditionalCompliance: verses.length >= 4 && verses.length <= 8 ? 'Cumple' : 'No cumple'
    };

    console.log(`   Versos: ${results.verseCount} (recomendado: 4-8)`);
    console.log(`   Patrón de rima: ${results.rhymePattern}`);
    console.log(`   Ritmo: ${results.rhythm}`);
    
    return results;
  }

  async suggestImprovements(template, validationResults) {
    console.log('💡 MCP Tool: suggest_improvements');
    console.log('   Generando sugerencias de mejora...');
    
    const suggestions = [];
    
    if (validationResults.poem && !validationResults.poem.isValid) {
      suggestions.push('Ajustar versos a octosílabos (8 sílabas)');
    }
    
    if (validationResults.cultural && validationResults.cultural.culturalScore < 70) {
      suggestions.push('Agregar más referencias del Día de Muertos');
      suggestions.push('Usar vocabulario más tradicional mexicano');
    }
    
    if (validationResults.metrics && validationResults.metrics.verseCount < 4) {
      suggestions.push('Expandir a mínimo 4 versos para tradición completa');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('¡Plantilla excelente! Cumple todos los estándares ✨');
    }

    console.log('   Sugerencias:');
    suggestions.forEach((suggestion, i) => {
      console.log(`   ${i + 1}. ${suggestion}`);
    });
    
    return { suggestions };
  }

  // Métodos auxiliares
  countSyllables(text) {
    // Aproximación simple para contar sílabas en español
    const vowels = 'aeiouáéíóúü';
    let count = 0;
    let prevWasVowel = false;
    
    for (let char of text.toLowerCase()) {
      const isVowel = vowels.includes(char);
      if (isVowel && !prevWasVowel) {
        count++;
      }
      prevWasVowel = isVowel;
    }
    
    return Math.max(1, count);
  }

  checkTone(template) {
    const positiveWords = ['alegre', 'festivo', 'divertido', 'gracioso', 'juguetón'];
    const negativeWords = ['triste', 'violento', 'ofensivo', 'cruel'];
    
    const hasPositive = positiveWords.some(word => template.toLowerCase().includes(word));
    const hasNegative = negativeWords.some(word => template.toLowerCase().includes(word));
    
    if (hasNegative) return 'Inapropiado ❌';
    if (hasPositive) return 'Excelente ✅';
    return 'Neutral ⚠️';
  }

  analyzeRhyme(verses) {
    // Análisis básico de rima
    if (verses.length < 2) return 'N/A';
    
    const lastWords = verses.map(verse => {
      const words = verse.trim().split(/\s+/);
      return words[words.length - 1]?.toLowerCase().replace(/[.,!?]/g, '') || '';
    });
    
    // Verificar si las últimas sílabas coinciden (rima aproximada)
    const endings = lastWords.map(word => word.slice(-2));
    const uniqueEndings = [...new Set(endings)];
    
    if (uniqueEndings.length <= Math.ceil(verses.length / 2)) {
      return 'Consonante/Asonante ✅';
    }
    
    return 'Libre ⚠️';
  }

  analyzeRhythm(template) {
    const stressPatterns = ['aguda', 'grave', 'esdrújula'];
    return 'Yámbico tradicional'; // Simplificado para demo
  }
}

// Demo principal
async function runMCPValidationDemo() {
  console.log('🎭 DEMO: Validación MCP de Nueva Plantilla de Calaverita\n');
  console.log('=' .repeat(60));
  
  // Plantilla de ejemplo para validar
  const newTemplate = `Aquí yace {name}, {profession} querido,
que por {trait} era conocido,
la flaca bonita lo llevó consigo,
al panteón como buen amigo.`;

  console.log('📝 Plantilla a validar:');
  console.log(newTemplate);
  console.log('\n' + '=' .repeat(60));
  
  const mcpTools = new MCPToolsDemo();
  const results = {};
  
  try {
    // Ejecutar herramientas MCP en secuencia
    console.log('\n🚀 Ejecutando herramientas MCP...\n');
    
    results.poem = await mcpTools.validatePoem(newTemplate);
    console.log();
    
    results.cultural = await mcpTools.culturalCheck(newTemplate);
    console.log();
    
    results.metrics = await mcpTools.analyzeMetrics(newTemplate);
    console.log();
    
    await mcpTools.suggestImprovements(newTemplate, results);
    
    // Resumen final
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RESUMEN DE VALIDACIÓN');
    console.log('=' .repeat(60));
    
    const overallScore = (
      (results.poem.isValid ? 25 : 0) +
      (results.cultural.culturalScore * 0.25) +
      (results.metrics.traditionalCompliance === 'Cumple' ? 25 : 0) +
      25 // Base score
    );
    
    console.log(`Puntuación general: ${overallScore.toFixed(1)}/100`);
    console.log(`Estado: ${overallScore >= 80 ? '✅ APROBADA' : overallScore >= 60 ? '⚠️ NECESITA MEJORAS' : '❌ REQUIERE REVISIÓN'}`);
    
    // Guardar resultados para referencia
    const reportPath = 'data/mcp-validation-report.json';
    const report = {
      timestamp: new Date().toISOString(),
      template: newTemplate,
      results,
      overallScore,
      status: overallScore >= 80 ? 'APPROVED' : overallScore >= 60 ? 'NEEDS_IMPROVEMENT' : 'NEEDS_REVISION'
    };
    
    // Asegurar que existe el directorio data
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data', { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Reporte guardado en: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Error durante validación MCP:', error.message);
  }
  
  console.log('\n🎉 Demo completado. En producción, estas herramientas se ejecutarían automáticamente con cada cambio.');
}

// Ejecutar demo si se llama directamente
if (require.main === module) {
  runMCPValidationDemo().catch(console.error);
}

module.exports = { MCPToolsDemo, runMCPValidationDemo };