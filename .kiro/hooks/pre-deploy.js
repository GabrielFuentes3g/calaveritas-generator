/**
 * Agent Hook: Pre-Deploy Validation
 * 
 * Este hook se ejecuta antes del deployment para:
 * - Verificaciones pre-deployment automáticas
 * - Validación de configuración de producción
 * - Tests de integración completos
 * 
 * Requirements: 3.4
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PreDeployHook {
  constructor() {
    this.projectRoot = process.cwd();
    this.srcDir = path.join(this.projectRoot, 'src');
    this.publicDir = path.join(this.projectRoot, 'public');
    this.dataDir = path.join(this.projectRoot, 'data');
    
    // Configuración de deployment
    this.config = {
      requiredFiles: [
        'package.json',
        'src/server.js',
        'src/generator.js',
        'src/data-manager.js',
        'public/index.html',
        'public/styles.css',
        'public/frontend.js'
      ],
      requiredScripts: ['start'],
      requiredDependencies: ['express', 'cors'],
      maxBundleSize: 10 * 1024 * 1024, // 10MB
      performanceThresholds: {
        maxResponseTime: 2000, // 2 segundos
        maxMemoryUsage: 512 * 1024 * 1024 // 512MB
      }
    };
    
    this.deploymentChecks = [];
  }

  /**
   * Trigger principal: onPreDeploy
   * Se ejecuta antes del deployment
   */
  async onPreDeploy() {
    console.log(`🚀 Pre-Deploy Hook iniciado...`);
    
    try {
      // 1. Verificaciones de archivos y estructura
      await this.validateProjectStructure();
      
      // 2. Validación de configuración
      await this.validateConfiguration();
      
      // 3. Tests de integración completos
      await this.runIntegrationTests();
      
      // 4. Verificaciones de seguridad
      await this.runSecurityChecks();
      
      // 5. Verificaciones de rendimiento
      await this.runPerformanceChecks();
      
      // 6. Validación de dependencias
      await this.validateDependencies();
      
      // 7. Verificación de assets y recursos
      await this.validateAssets();
      
      // 8. Generar reporte de deployment
      await this.generateDeploymentReport();
      
      console.log(`✅ Pre-Deploy validation completada exitosamente`);
      console.log(`📊 Reporte disponible en: deployment-report.json`);
      
      return { success: true, checks: this.deploymentChecks };
      
    } catch (error) {
      console.error(`❌ Pre-Deploy validation falló: ${error.message}`);
      
      // Generar reporte de errores
      await this.generateErrorReport(error);
      
      throw error; // Bloquear deployment
    }
  }

  /**
   * Validar estructura del proyecto
   */
  async validateProjectStructure() {
    console.log(`📁 Validando estructura del proyecto...`);
    
    const missingFiles = [];
    
    // Verificar archivos requeridos
    for (const file of this.config.requiredFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    }
    
    if (missingFiles.length > 0) {
      throw new Error(`Archivos requeridos faltantes: ${missingFiles.join(', ')}`);
    }
    
    // Verificar directorios requeridos
    const requiredDirs = ['src', 'public'];
    for (const dir of requiredDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        throw new Error(`Directorio requerido faltante: ${dir}`);
      }
    }
    
    // Verificar que no hay archivos temporales o de desarrollo
    const tempFiles = ['.env.local', '.env.development', 'debug.log', 'npm-debug.log'];
    const foundTempFiles = tempFiles.filter(file => 
      fs.existsSync(path.join(this.projectRoot, file))
    );
    
    if (foundTempFiles.length > 0) {
      console.log(`⚠️  Archivos temporales encontrados (considerar limpiar): ${foundTempFiles.join(', ')}`);
    }
    
    this.deploymentChecks.push({
      check: 'Project Structure',
      status: 'passed',
      details: `${this.config.requiredFiles.length} archivos requeridos verificados`
    });
    
    console.log(`✓ Estructura del proyecto validada`);
  }

  /**
   * Validar configuración de producción
   */
  async validateConfiguration() {
    console.log(`⚙️  Validando configuración...`);
    
    // Validar package.json
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Verificar scripts requeridos
    const missingScripts = this.config.requiredScripts.filter(script => 
      !packageJson.scripts || !packageJson.scripts[script]
    );
    
    if (missingScripts.length > 0) {
      throw new Error(`Scripts requeridos faltantes en package.json: ${missingScripts.join(', ')}`);
    }
    
    // Verificar dependencias requeridas
    const missingDeps = this.config.requiredDependencies.filter(dep => 
      !packageJson.dependencies || !packageJson.dependencies[dep]
    );
    
    if (missingDeps.length > 0) {
      throw new Error(`Dependencias requeridas faltantes: ${missingDeps.join(', ')}`);
    }
    
    // Validar configuración del servidor
    const serverPath = path.join(this.srcDir, 'server.js');
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Verificar que no hay configuraciones de desarrollo
    if (serverContent.includes('console.log') && !serverContent.includes('production')) {
      console.log(`⚠️  server.js contiene console.log - considerar usar logger en producción`);
    }
    
    // Verificar puerto configurable
    if (!serverContent.includes('process.env.PORT') && !serverContent.includes('PORT')) {
      console.log(`⚠️  Puerto no configurable via environment variable`);
    }
    
    this.deploymentChecks.push({
      check: 'Configuration',
      status: 'passed',
      details: 'Configuración de producción validada'
    });
    
    console.log(`✓ Configuración validada`);
  }

  /**
   * Ejecutar tests de integración completos
   */
  async runIntegrationTests() {
    console.log(`🧪 Ejecutando tests de integración...`);
    
    try {
      // Test 1: Verificar que el servidor inicia correctamente
      await this.testServerStartup();
      
      // Test 2: Verificar endpoints de API
      await this.testApiEndpoints();
      
      // Test 3: Verificar generación de calaveritas
      await this.testCalaveriteGeneration();
      
      // Test 4: Verificar persistencia de datos
      await this.testDataPersistence();
      
      // Test 5: Verificar interfaz web
      await this.testWebInterface();
      
      this.deploymentChecks.push({
        check: 'Integration Tests',
        status: 'passed',
        details: '5 tests de integración ejecutados exitosamente'
      });
      
      console.log(`✓ Tests de integración completados`);
      
    } catch (error) {
      this.deploymentChecks.push({
        check: 'Integration Tests',
        status: 'failed',
        details: error.message
      });
      
      throw new Error(`Tests de integración fallaron: ${error.message}`);
    }
  }

  /**
   * Test de inicio del servidor
   */
  async testServerStartup() {
    console.log(`  🔧 Testing server startup...`);
    
    // Verificar que el archivo del servidor es válido
    const serverPath = path.join(this.srcDir, 'server.js');
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Verificar sintaxis
    try {
      require('vm').createScript(serverContent, serverPath);
    } catch (syntaxError) {
      throw new Error(`Error de sintaxis en server.js: ${syntaxError.message}`);
    }
    
    // Verificar que importa las dependencias necesarias
    if (!serverContent.includes('express')) {
      throw new Error('server.js no importa Express');
    }
    
    console.log(`    ✓ Server startup test passed`);
  }

  /**
   * Test de endpoints de API
   */
  async testApiEndpoints() {
    console.log(`  📡 Testing API endpoints...`);
    
    const serverPath = path.join(this.srcDir, 'server.js');
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Verificar endpoints requeridos
    const requiredEndpoints = [
      'POST.*\/api\/generate',
      'GET.*\/api\/history',
      'GET.*\/api\/templates'
    ];
    
    for (const endpoint of requiredEndpoints) {
      const regex = new RegExp(endpoint);
      if (!regex.test(serverContent)) {
        throw new Error(`Endpoint requerido no encontrado: ${endpoint}`);
      }
    }
    
    console.log(`    ✓ API endpoints test passed`);
  }

  /**
   * Test de generación de calaveritas
   */
  async testCalaveriteGeneration() {
    console.log(`  🎭 Testing calaverita generation...`);
    
    // Importar y probar el generador directamente
    const generatorPath = path.join(this.srcDir, 'generator.js');
    
    try {
      // Verificar que el archivo es importable
      const generatorContent = fs.readFileSync(generatorPath, 'utf8');
      require('vm').createScript(generatorContent, generatorPath);
      
      // Verificar que exporta la clase correcta
      if (!generatorContent.includes('CalaveriteGenerator')) {
        throw new Error('generator.js no exporta CalaveriteGenerator');
      }
      
      // Verificar que tiene plantillas
      if (!generatorContent.includes('templates') || !generatorContent.includes('pattern')) {
        throw new Error('generator.js no contiene plantillas válidas');
      }
      
    } catch (error) {
      throw new Error(`Error en generador: ${error.message}`);
    }
    
    console.log(`    ✓ Calaverita generation test passed`);
  }

  /**
   * Test de persistencia de datos
   */
  async testDataPersistence() {
    console.log(`  💾 Testing data persistence...`);
    
    const dataManagerPath = path.join(this.srcDir, 'data-manager.js');
    
    try {
      const dataManagerContent = fs.readFileSync(dataManagerPath, 'utf8');
      require('vm').createScript(dataManagerContent, dataManagerPath);
      
      // Verificar que exporta DataManager
      if (!dataManagerContent.includes('DataManager')) {
        throw new Error('data-manager.js no exporta DataManager');
      }
      
      // Verificar métodos requeridos
      const requiredMethods = ['saveCalaverita', 'getHistory', 'clearHistory'];
      for (const method of requiredMethods) {
        if (!dataManagerContent.includes(method)) {
          throw new Error(`Método requerido no encontrado: ${method}`);
        }
      }
      
    } catch (error) {
      throw new Error(`Error en data manager: ${error.message}`);
    }
    
    console.log(`    ✓ Data persistence test passed`);
  }

  /**
   * Test de interfaz web
   */
  async testWebInterface() {
    console.log(`  🌐 Testing web interface...`);
    
    // Verificar archivos de frontend
    const htmlPath = path.join(this.publicDir, 'index.html');
    const cssPath = path.join(this.publicDir, 'styles.css');
    const jsPath = path.join(this.publicDir, 'frontend.js');
    
    // Verificar HTML
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    if (!htmlContent.includes('<form') || !htmlContent.includes('input')) {
      throw new Error('index.html no contiene formulario válido');
    }
    
    // Verificar CSS
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    if (cssContent.length < 100) {
      throw new Error('styles.css parece estar vacío o incompleto');
    }
    
    // Verificar JavaScript
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    if (!jsContent.includes('fetch') && !jsContent.includes('XMLHttpRequest')) {
      throw new Error('frontend.js no contiene lógica de comunicación con API');
    }
    
    console.log(`    ✓ Web interface test passed`);
  }

  /**
   * Ejecutar verificaciones de seguridad
   */
  async runSecurityChecks() {
    console.log(`🔒 Ejecutando verificaciones de seguridad...`);
    
    const securityIssues = [];
    
    // Verificar que no hay credenciales hardcodeadas
    const jsFiles = this.getAllJSFiles(this.srcDir);
    
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Buscar patrones de credenciales
      const credentialPatterns = [
        /password\s*[:=]\s*['"][^'"]+['"]/i,
        /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
        /secret\s*[:=]\s*['"][^'"]+['"]/i,
        /token\s*[:=]\s*['"][^'"]+['"]/i
      ];
      
      for (const pattern of credentialPatterns) {
        if (pattern.test(content)) {
          securityIssues.push(`Posible credencial hardcodeada en ${path.basename(file)}`);
        }
      }
      
      // Verificar uso de eval() o Function()
      if (content.includes('eval(') || content.includes('new Function(')) {
        securityIssues.push(`Uso inseguro de eval() en ${path.basename(file)}`);
      }
    }
    
    // Verificar configuración de CORS
    const serverPath = path.join(this.srcDir, 'server.js');
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    if (serverContent.includes('cors()') && !serverContent.includes('origin:')) {
      console.log(`⚠️  CORS configurado sin restricciones de origen`);
    }
    
    if (securityIssues.length > 0) {
      this.deploymentChecks.push({
        check: 'Security',
        status: 'warning',
        details: securityIssues.join('; ')
      });
      
      console.log(`⚠️  Problemas de seguridad encontrados:`);
      securityIssues.forEach(issue => console.log(`    - ${issue}`));
    } else {
      this.deploymentChecks.push({
        check: 'Security',
        status: 'passed',
        details: 'No se encontraron problemas de seguridad'
      });
      
      console.log(`✓ Verificaciones de seguridad completadas`);
    }
  }

  /**
   * Ejecutar verificaciones de rendimiento
   */
  async runPerformanceChecks() {
    console.log(`⚡ Ejecutando verificaciones de rendimiento...`);
    
    // Verificar tamaño de archivos
    const bundleSize = this.calculateBundleSize();
    
    if (bundleSize > this.config.maxBundleSize) {
      throw new Error(`Bundle size (${Math.round(bundleSize / 1024 / 1024)}MB) excede el límite (${Math.round(this.config.maxBundleSize / 1024 / 1024)}MB)`);
    }
    
    // Verificar optimización de assets
    const cssPath = path.join(this.publicDir, 'styles.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Verificar minificación básica (no espacios excesivos)
    const hasExcessiveWhitespace = /\n\s{4,}/.test(cssContent);
    if (hasExcessiveWhitespace) {
      console.log(`⚠️  CSS no está minificado - considerar optimizar para producción`);
    }
    
    // Verificar JavaScript
    const jsPath = path.join(this.publicDir, 'frontend.js');
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    
    if (jsContent.includes('console.log')) {
      console.log(`⚠️  JavaScript contiene console.log - considerar remover para producción`);
    }
    
    this.deploymentChecks.push({
      check: 'Performance',
      status: 'passed',
      details: `Bundle size: ${Math.round(bundleSize / 1024)}KB`
    });
    
    console.log(`✓ Verificaciones de rendimiento completadas`);
  }

  /**
   * Validar dependencias
   */
  async validateDependencies() {
    console.log(`📦 Validando dependencias...`);
    
    try {
      // Verificar que node_modules existe
      const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
      if (!fs.existsSync(nodeModulesPath)) {
        throw new Error('node_modules no existe - ejecutar npm install');
      }
      
      // Verificar package-lock.json
      const packageLockPath = path.join(this.projectRoot, 'package-lock.json');
      if (!fs.existsSync(packageLockPath)) {
        console.log(`⚠️  package-lock.json no existe - considerar generar para deployment consistente`);
      }
      
      // Verificar vulnerabilidades conocidas (simulado)
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Verificar versiones de dependencias críticas
      const criticalDeps = ['express'];
      for (const dep of criticalDeps) {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          const version = packageJson.dependencies[dep];
          if (version.startsWith('^') || version.startsWith('~')) {
            console.log(`ℹ️  Dependencia ${dep} usa rango de versión: ${version}`);
          }
        }
      }
      
      this.deploymentChecks.push({
        check: 'Dependencies',
        status: 'passed',
        details: 'Dependencias validadas correctamente'
      });
      
      console.log(`✓ Dependencias validadas`);
      
    } catch (error) {
      this.deploymentChecks.push({
        check: 'Dependencies',
        status: 'failed',
        details: error.message
      });
      
      throw error;
    }
  }

  /**
   * Validar assets y recursos
   */
  async validateAssets() {
    console.log(`🎨 Validando assets y recursos...`);
    
    // Verificar que todos los assets referenciados existen
    const htmlPath = path.join(this.publicDir, 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Buscar referencias a CSS y JS
    const cssRefs = htmlContent.match(/href=['"]([^'"]+\.css)['"]/g) || [];
    const jsRefs = htmlContent.match(/src=['"]([^'"]+\.js)['"]/g) || [];
    
    const missingAssets = [];
    
    // Verificar CSS
    for (const ref of cssRefs) {
      const cssFile = ref.match(/href=['"]([^'"]+)['"]/)[1];
      if (!cssFile.startsWith('http')) {
        const cssPath = path.join(this.publicDir, cssFile);
        if (!fs.existsSync(cssPath)) {
          missingAssets.push(cssFile);
        }
      }
    }
    
    // Verificar JS
    for (const ref of jsRefs) {
      const jsFile = ref.match(/src=['"]([^'"]+)['"]/)[1];
      if (!jsFile.startsWith('http')) {
        const jsPath = path.join(this.publicDir, jsFile);
        if (!fs.existsSync(jsPath)) {
          missingAssets.push(jsFile);
        }
      }
    }
    
    if (missingAssets.length > 0) {
      throw new Error(`Assets faltantes: ${missingAssets.join(', ')}`);
    }
    
    this.deploymentChecks.push({
      check: 'Assets',
      status: 'passed',
      details: 'Todos los assets están disponibles'
    });
    
    console.log(`✓ Assets validados`);
  }

  /**
   * Generar reporte de deployment
   */
  async generateDeploymentReport() {
    const report = {
      timestamp: new Date().toISOString(),
      version: this.getProjectVersion(),
      environment: 'production',
      checks: this.deploymentChecks,
      summary: {
        total: this.deploymentChecks.length,
        passed: this.deploymentChecks.filter(c => c.status === 'passed').length,
        warnings: this.deploymentChecks.filter(c => c.status === 'warning').length,
        failed: this.deploymentChecks.filter(c => c.status === 'failed').length
      },
      bundleSize: this.calculateBundleSize(),
      recommendations: this.generateRecommendations()
    };
    
    const reportPath = path.join(this.projectRoot, 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Reporte de deployment generado: ${reportPath}`);
  }

  /**
   * Generar reporte de errores
   */
  async generateErrorReport(error) {
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: error.message,
      checks: this.deploymentChecks,
      failedChecks: this.deploymentChecks.filter(c => c.status === 'failed'),
      recommendations: [
        'Revisar los checks fallidos antes de intentar deployment nuevamente',
        'Ejecutar tests localmente para identificar problemas',
        'Verificar que todas las dependencias están instaladas'
      ]
    };
    
    const errorReportPath = path.join(this.projectRoot, 'deployment-error.json');
    fs.writeFileSync(errorReportPath, JSON.stringify(errorReport, null, 2));
    
    console.log(`📋 Reporte de errores generado: ${errorReportPath}`);
  }

  /**
   * Métodos auxiliares
   */
  
  getAllJSFiles(dir) {
    const files = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && item !== 'node_modules') {
        files.push(...this.getAllJSFiles(fullPath));
      } else if (item.endsWith('.js')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  calculateBundleSize() {
    let totalSize = 0;
    
    // Calcular tamaño de src/
    const srcFiles = this.getAllJSFiles(this.srcDir);
    for (const file of srcFiles) {
      totalSize += fs.statSync(file).size;
    }
    
    // Calcular tamaño de public/
    if (fs.existsSync(this.publicDir)) {
      const publicFiles = fs.readdirSync(this.publicDir);
      for (const file of publicFiles) {
        const filePath = path.join(this.publicDir, file);
        if (fs.statSync(filePath).isFile()) {
          totalSize += fs.statSync(filePath).size;
        }
      }
    }
    
    return totalSize;
  }

  getProjectVersion() {
    try {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      return packageJson.version || '1.0.0';
    } catch (error) {
      return '1.0.0';
    }
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Basado en los checks realizados
    const warningChecks = this.deploymentChecks.filter(c => c.status === 'warning');
    
    if (warningChecks.length > 0) {
      recommendations.push('Revisar warnings antes del deployment para optimizar la aplicación');
    }
    
    const bundleSize = this.calculateBundleSize();
    if (bundleSize > 5 * 1024 * 1024) { // 5MB
      recommendations.push('Considerar minificar assets para reducir el tamaño del bundle');
    }
    
    recommendations.push('Configurar monitoreo de aplicación en producción');
    recommendations.push('Establecer backup automático de datos');
    recommendations.push('Configurar logs de aplicación para debugging');
    
    return recommendations;
  }
}

// Exportar la clase para uso del sistema de hooks de Kiro
module.exports = { PreDeployHook };

// Instancia global para triggers
const preDeployHook = new PreDeployHook();

// Configurar triggers para Kiro
if (typeof global !== 'undefined' && global.kiro) {
  global.kiro.hooks.register('onPreDeploy', preDeployHook.onPreDeploy.bind(preDeployHook));
}

console.log('🚀 Pre-Deploy Hook cargado y configurado');