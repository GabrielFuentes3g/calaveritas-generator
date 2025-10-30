#!/usr/bin/env node

/**
 * MCP Integration Demo Script
 * Demonstrates the MCP → Validation → Integration workflow
 */

const { CalaveriteGenerator } = require('../src/generator');

async function runMCPDemo() {
  console.log('🎭 === DEMO: MCP Integration Workflow ===\n');
  
  const generator = new CalaveriteGenerator();
  
  // 1. Show MCP Status
  console.log('📊 1. Estado de Integración MCP:');
  const status = generator.getMCPStatus();
  console.log(`   MCP Habilitado: ${status.mcpEnabled ? '✅' : '❌'}`);
  console.log(`   Herramientas: ${status.availableTools.join(', ')}`);
  console.log(`   Workflow: ${status.workflow}\n`);
  
  // 2. Generate New Template with MCP
  console.log('🎨 2. Generando nueva plantilla con MCP:');
  try {
    const newTemplate = await generator.generateTemplateWithMCP('artista', 'moderno');
    console.log(`   ✨ Plantilla generada: "${newTemplate.name}"`);
    console.log(`   📊 Puntuación cultural: ${newTemplate.culturalScore}/100`);
    console.log(`   🎵 Puntuación poética: ${newTemplate.poeticScore}/100`);
    console.log(`   📝 Patrón: ${newTemplate.pattern.substring(0, 50)}...\n`);
    
    // 3. Validate Template with MCP
    console.log('🔍 3. Validando plantilla con herramientas MCP:');
    const validation = await generator.validateTemplateWithMCP(newTemplate);
    console.log(`   Cultural: ${validation.culturalScore}/100`);
    console.log(`   Poética: ${validation.poeticScore}/100`);
    console.log(`   ¿Integrar?: ${validation.shouldIntegrate ? '✅ Sí' : '❌ No'}`);
    
    if (validation.suggestions.length > 0) {
      console.log('   💡 Sugerencias:');
      validation.suggestions.forEach((suggestion, i) => {
        console.log(`      ${i + 1}. ${suggestion}`);
      });
    }
    console.log();
    
    // 4. Integration Decision
    console.log('⚙️  4. Proceso de Integración:');
    const integrationResult = await generator.addTemplateWithValidation(newTemplate);
    
    if (integrationResult.success) {
      console.log('   ✅ Plantilla integrada exitosamente al sistema');
      console.log(`   📈 Total de plantillas: ${generator.templates.length}`);
    } else {
      console.log('   ❌ Plantilla no cumple criterios de calidad');
      console.log('   🔧 Aplicar sugerencias y reintentar');
    }
    console.log();
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
  
  // 5. Enhanced Generation with MCP Context
  console.log('🎭 5. Generación mejorada con contexto MCP:');
  try {
    const enhancedCalaverita = await generator.generateWithMCPContext(
      'Ana Martínez',
      'artista',
      'creativa'
    );
    
    console.log('   ✨ Calaverita generada con contexto MCP:');
    console.log(`   👤 Persona: ${enhancedCalaverita.name}`);
    console.log(`   💼 Profesión: ${enhancedCalaverita.profession}`);
    console.log(`   🎨 Plantilla: ${enhancedCalaverita.templateName}`);
    console.log('   📜 Texto:');
    console.log(`      ${enhancedCalaverita.text.replace(/\n/g, '\n      ')}`);
    
    if (enhancedCalaverita.metadata.mcpValidation) {
      const mcpVal = enhancedCalaverita.metadata.mcpValidation;
      console.log(`   📊 Validación MCP: Cultural ${mcpVal.culturalScore}/100, Poética ${mcpVal.poeticScore}/100`);
    }
    console.log();
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
  
  // 6. Show Benefits Summary
  console.log('🚀 6. Beneficios del Stack MCP:');
  status.benefits.forEach((benefit, i) => {
    console.log(`   ${i + 1}. ${benefit}`);
  });
  
  console.log('\n🎉 === Demo Completado ===');
  console.log('💡 Para más detalles, ver: docs/mcp-development-workflow.md');
}

// Run demo if called directly
if (require.main === module) {
  runMCPDemo().catch(console.error);
}

module.exports = { runMCPDemo };