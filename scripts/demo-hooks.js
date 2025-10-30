/**
 * Demo Script: Agent Hooks Functionality
 * 
 * Este script demuestra el funcionamiento de los Agent Hooks implementados
 */

const { AutoTestHook } = require('../.kiro/hooks/auto-test');
const { AutoDocsHook } = require('../.kiro/hooks/auto-docs');
const { PreDeployHook } = require('../.kiro/hooks/pre-deploy');

async function demoAutoTestHook() {
  console.log('\n🎭 === DEMO: Auto-Test Hook ===\n');
  
  const autoTest = new AutoTestHook();
  
  // Simular guardado de archivo
  console.log('Simulando guardado de src/generator.js...');
  await autoTest.onSave('./src/generator.js');
  
  // Simular cambio de archivo
  console.log('\nSimulando cambio en src/data-manager.js...');
  await autoTest.onFileChange('./src/data-manager.js');
  
  // Simular pre-commit
  console.log('\nSimulando pre-commit con archivos cambiados...');
  try {
    await autoTest.onCommit(['./src/generator.js', './src/validator.js']);
  } catch (error) {
    console.log(`Pre-commit validation: ${error.message}`);
  }
}

async function demoAutoDocsHook() {
  console.log('\n📝 === DEMO: Auto-Docs Hook ===\n');
  
  const autoDocs = new AutoDocsHook();
  
  // Simular adición de nueva plantilla
  console.log('Simulando adición de nueva plantilla...');
  const newTemplate = {
    id: 'demo',
    name: 'Demo Template',
    pattern: 'Esta es una plantilla de demo para {name}...',
    requiresTrait: true,
    description: 'Plantilla de demostración para testing'
  };
  
  await autoDocs.onTemplateAdd(newTemplate);
  
  // Simular cambio en API
  console.log('\nSimulando cambio en API...');
  await autoDocs.onApiChange('./src/server.js');
  
  // Simular cambio en documentación
  console.log('\nSimulando validación de documentación...');
  await autoDocs.onDocumentationChange('./README.md');
}

async function demoPreDeployHook() {
  console.log('\n🚀 === DEMO: Pre-Deploy Hook ===\n');
  
  const preDeploy = new PreDeployHook();
  
  // Simular pre-deployment validation
  console.log('Ejecutando validación completa de pre-deployment...');
  try {
    const result = await preDeploy.onPreDeploy();
    console.log('\n✅ Pre-deployment validation exitosa!');
    console.log(`📊 Checks completados: ${result.checks.length}`);
    
    // Mostrar resumen de checks
    const summary = result.checks.reduce((acc, check) => {
      acc[check.status] = (acc[check.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📈 Resumen de validaciones:');
    Object.entries(summary).forEach(([status, count]) => {
      const emoji = status === 'passed' ? '✅' : status === 'warning' ? '⚠️' : '❌';
      console.log(`   ${emoji} ${status}: ${count}`);
    });
    
  } catch (error) {
    console.log(`\n❌ Pre-deployment validation falló: ${error.message}`);
  }
}

async function runAllDemos() {
  console.log('🎭 Iniciando demostración de Agent Hooks...\n');
  
  try {
    await demoAutoTestHook();
    await demoAutoDocsHook();
    await demoPreDeployHook();
    
    console.log('\n🎉 === DEMO COMPLETADO ===');
    console.log('\nLos Agent Hooks están configurados y funcionando correctamente!');
    console.log('\nFuncionalidades implementadas:');
    console.log('✅ Auto-Test Hook: Validación automática y tests');
    console.log('✅ Auto-Docs Hook: Documentación automática');
    console.log('✅ Pre-Deploy Hook: Validación pre-deployment');
    
    console.log('\nPara usar en desarrollo real:');
    console.log('- Los hooks se activarán automáticamente en Kiro');
    console.log('- Configurar triggers en .kiro/hooks/');
    console.log('- Personalizar configuración según necesidades del proyecto');
    
  } catch (error) {
    console.error(`\n❌ Error en demo: ${error.message}`);
  }
}

// Ejecutar demo si se llama directamente
if (require.main === module) {
  runAllDemos();
}

module.exports = {
  demoAutoTestHook,
  demoAutoDocsHook,
  demoPreDeployHook,
  runAllDemos
};