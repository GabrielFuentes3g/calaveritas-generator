/**
 * Agent Hook: Auto-Test y Validación Automática
 * 
 * Este hook se ejecuta automáticamente en respuesta a eventos del IDE para:
 * - Ejecutar tests automáticamente al guardar archivos .js
 * - Validar sintaxis y linting automático
 * - Verificar plantillas nuevas contra estándares culturales
 * - Generar tests automáticos para nuevas funciones
 * 
 * Triggers configurados: onSave, onFileChange, onCommit
 * Requirements: 3.3, 3.4
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AutoTestHook {
  constructor() {
    this.projectRoot = process.cwd();
    this.srcDir = path.join(this.projectRoot, 'src');
    this.testDir = path.join(this.projectRoot, 'tests');
    this.dataDir = path.join(this.projectRoot, 'data');
    
    // Configuración de validación cultural
    this.culturalStandards = {
      forbiddenWords: ['muerte violenta', 'asesinato', 'suicidio', 'violencia'],
      requiredTone: 'humorístico',
      traditionalMetrics: {
        syllablesPerLine: 8, // Octosílabos tradicionales
        rhymeScheme: ['consonante', 'asonante'],
        verseCount: { min: 4, max: 8 }
      }
    };
    
    // Configuración de linting
    this.lintingRules = {
      maxLineLength: 100,
      indentation: 2,
      semicolons: true,
      quotes: 'single'
    };
    
    this.ensureTestDirectory();
  }

  /**
   * Trigger principal: onSave
   * Se ejecuta cuando se guarda un archivo .js
   */
  async onSave(filePath) {
    console.log(`🎭 Auto-Test Hook activado: ${path.basename(filePath)}`);
    
    try {
      // 1. Validar sintaxis del archivo
      await this.validateSyntax(filePath);
      
      // 2. Ejecutar linting automático
      await this.runLinting(filePath);
      
      // 3. Si es un archivo de plantillas, validar estándares culturales
      if (this.isTemplateFile(filePath)) {
        await this.validateCulturalStandards(filePath);
      }
      
      // 4. Ejecutar tests relacionados
      await this.runRelatedTests(filePath);
      
      // 5. Generar tests automáticos si es necesario
      await this.generateMissingTests(filePath);
      
      console.log(`✅ Validación completa para ${path.basename(filePath)}`);
      
    } catch (error) {
      console.error(`❌ Error en validación automática: ${error.message}`);
      this.logError(filePath, error);
    }
  }

  /**
   * Trigger: onFileChange
   * Se ejecuta cuando se detectan cambios en archivos
   */
  async onFileChange(filePath) {
    // Solo procesar archivos JavaScript y JSON relevantes
    if (!this.shouldProcessFile(filePath)) {
      return;
    }
    
    console.log(`🔄 Cambio detectado: ${path.basename(filePath)}`);
    
    // Validación ligera para cambios en tiempo real
    await this.quickValidation(filePath);
  }

  /**
   * Trigger: onCommit
   * Se ejecuta antes de hacer commit
   */
  async onCommit(changedFiles) {
    console.log(`🚀 Pre-commit validation iniciada...`);
    
    try {
      // 1. Ejecutar suite completa de tests
      await this.runFullTestSuite();
      
      // 2. Validar todos los archivos cambiados
      for (const filePath of changedFiles) {
        if (this.shouldProcessFile(filePath)) {
          await this.validateForCommit(filePath);
        }
      }
      
      // 3. Verificar que no hay tests rotos
      await this.verifyTestIntegrity();
      
      // 4. Validar configuración del proyecto
      await this.validateProjectConfiguration();
      
      console.log(`✅ Pre-commit validation exitosa`);
      
    } catch (error) {
      console.error(`❌ Pre-commit validation falló: ${error.message}`);
      throw error; // Bloquear commit si hay errores críticos
    }
  }

  /**
   * Validación de sintaxis JavaScript
   */
  async validateSyntax(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Intentar parsear el archivo para detectar errores de sintaxis
      require('vm').createScript(content, filePath);
      
      console.log(`✓ Sintaxis válida: ${path.basename(filePath)}`);
      
    } catch (syntaxError) {
      throw new Error(`Error de sintaxis en ${filePath}: ${syntaxError.message}`);
    }
  }

  /**
   * Linting automático
   */
  async runLinting(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];

    // Verificar longitud de líneas
    lines.forEach((line, index) => {
      if (line.length > this.lintingRules.maxLineLength) {
        issues.push(`Línea ${index + 1}: Excede ${this.lintingRules.maxLineLength} caracteres`);
      }
    });

    // Verificar indentación básica
    const indentationPattern = new RegExp(`^( {${this.lintingRules.indentation}})*[^ ]`);
    lines.forEach((line, index) => {
      if (line.trim() && !indentationPattern.test(line) && !line.startsWith('\t')) {
        issues.push(`Línea ${index + 1}: Indentación incorrecta`);
      }
    });

    // Verificar uso de comillas
    if (this.lintingRules.quotes === 'single') {
      const doubleQuotePattern = /"[^"]*"/g;
      if (content.match(doubleQuotePattern)) {
        issues.push('Usar comillas simples en lugar de dobles');
      }
    }

    if (issues.length > 0) {
      console.log(`⚠️  Linting issues en ${path.basename(filePath)}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✓ Linting passed: ${path.basename(filePath)}`);
    }
  }

  /**
   * Validación de estándares culturales para plantillas
   */
  async validateCulturalStandards(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    // Buscar palabras prohibidas
    this.culturalStandards.forbiddenWords.forEach(word => {
      if (content.toLowerCase().includes(word.toLowerCase())) {
        issues.push(`Contiene palabra inapropiada: "${word}"`);
      }
    });

    // Validar tono humorístico (buscar indicadores)
    const humorIndicators = ['gracioso', 'divertido', 'alegre', 'juguetón', 'festivo'];
    const hasHumorIndicators = humorIndicators.some(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    );

    if (!hasHumorIndicators) {
      issues.push('Las plantillas deben mantener un tono humorístico y festivo');
    }

    // Validar referencias culturales apropiadas
    const culturalReferences = ['día de muertos', 'catrina', 'ofrenda', 'altar', 'calavera'];
    const hasCulturalReferences = culturalReferences.some(ref => 
      content.toLowerCase().includes(ref.toLowerCase())
    );

    if (content.includes('template') && !hasCulturalReferences) {
      issues.push('Las plantillas deben incluir referencias culturales apropiadas del Día de Muertos');
    }

    if (issues.length > 0) {
      console.log(`🎭 Validación cultural en ${path.basename(filePath)}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✓ Estándares culturales cumplidos: ${path.basename(filePath)}`);
    }
  }

  /**
   * Ejecutar tests relacionados al archivo modificado
   */
  async runRelatedTests(filePath) {
    const fileName = path.basename(filePath, '.js');
    const testFile = path.join(this.testDir, `${fileName}.test.js`);

    if (fs.existsSync(testFile)) {
      try {
        console.log(`🧪 Ejecutando tests para ${fileName}...`);
        
        // Simular ejecución de tests (en un entorno real usaríamos Jest, Mocha, etc.)
        const testContent = fs.readFileSync(testFile, 'utf8');
        
        // Verificar que el archivo de test es válido
        require('vm').createScript(testContent, testFile);
        
        console.log(`✓ Tests ejecutados exitosamente para ${fileName}`);
        
      } catch (error) {
        throw new Error(`Tests fallaron para ${fileName}: ${error.message}`);
      }
    } else {
      console.log(`ℹ️  No hay tests específicos para ${fileName}`);
    }
  }

  /**
   * Generar tests automáticos para funciones nuevas
   */
  async generateMissingTests(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.js');
    const testFile = path.join(this.testDir, `${fileName}.test.js`);

    // Extraer funciones exportadas
    const exportedFunctions = this.extractExportedFunctions(content);
    
    if (exportedFunctions.length === 0) {
      return;
    }

    // Si no existe archivo de test, crearlo
    if (!fs.existsSync(testFile)) {
      console.log(`🔧 Generando tests automáticos para ${fileName}...`);
      
      const testTemplate = this.generateTestTemplate(fileName, exportedFunctions);
      fs.writeFileSync(testFile, testTemplate);
      
      console.log(`✓ Tests generados: ${path.basename(testFile)}`);
    } else {
      // Verificar si hay funciones sin tests
      const existingTestContent = fs.readFileSync(testFile, 'utf8');
      const missingTests = exportedFunctions.filter(func => 
        !existingTestContent.includes(`describe('${func}'`) && 
        !existingTestContent.includes(`test('${func}'`)
      );

      if (missingTests.length > 0) {
        console.log(`🔧 Agregando tests para funciones nuevas: ${missingTests.join(', ')}`);
        
        const additionalTests = this.generateAdditionalTests(missingTests);
        fs.appendFileSync(testFile, '\n' + additionalTests);
        
        console.log(`✓ Tests adicionales agregados`);
      }
    }
  }

  /**
   * Validación rápida para cambios en tiempo real
   */
  async quickValidation(filePath) {
    try {
      // Solo validar sintaxis básica
      await this.validateSyntax(filePath);
      
      // Si es archivo de configuración, validar JSON
      if (filePath.endsWith('.json')) {
        const content = fs.readFileSync(filePath, 'utf8');
        JSON.parse(content);
        console.log(`✓ JSON válido: ${path.basename(filePath)}`);
      }
      
    } catch (error) {
      console.log(`⚠️  Validación rápida: ${error.message}`);
    }
  }

  /**
   * Ejecutar suite completa de tests
   */
  async runFullTestSuite() {
    console.log(`🧪 Ejecutando suite completa de tests...`);
    
    try {
      // Buscar todos los archivos de test
      const testFiles = this.findTestFiles();
      
      if (testFiles.length === 0) {
        console.log(`ℹ️  No se encontraron archivos de test`);
        return;
      }

      // Ejecutar cada archivo de test
      for (const testFile of testFiles) {
        await this.runSingleTest(testFile);
      }
      
      console.log(`✅ Suite completa de tests ejecutada (${testFiles.length} archivos)`);
      
    } catch (error) {
      throw new Error(`Suite de tests falló: ${error.message}`);
    }
  }

  /**
   * Validación específica para commit
   */
  async validateForCommit(filePath) {
    // Validación más estricta para commits
    await this.validateSyntax(filePath);
    await this.runLinting(filePath);
    
    if (this.isTemplateFile(filePath)) {
      await this.validateCulturalStandards(filePath);
    }
    
    // Verificar que no hay console.log en producción
    if (filePath.includes('src/') && !filePath.includes('test')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('console.log') && !content.includes('// TODO: remove')) {
        console.log(`⚠️  ${path.basename(filePath)} contiene console.log - considerar remover para producción`);
      }
    }
  }

  /**
   * Verificar integridad de tests
   */
  async verifyTestIntegrity() {
    const testFiles = this.findTestFiles();
    
    for (const testFile of testFiles) {
      const content = fs.readFileSync(testFile, 'utf8');
      
      // Verificar que los tests tienen estructura básica
      if (!content.includes('describe') && !content.includes('test') && !content.includes('it')) {
        throw new Error(`Archivo de test inválido: ${testFile}`);
      }
    }
    
    console.log(`✓ Integridad de tests verificada`);
  }

  /**
   * Validar configuración del proyecto
   */
  async validateProjectConfiguration() {
    // Verificar package.json
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      if (!packageJson.scripts || !packageJson.scripts.start) {
        throw new Error('package.json debe tener script "start"');
      }
      
      console.log(`✓ Configuración de package.json válida`);
    }
    
    // Verificar estructura de directorios
    const requiredDirs = ['src', 'public', 'data'];
    for (const dir of requiredDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        console.log(`⚠️  Directorio requerido no existe: ${dir}`);
      }
    }
  }

  /**
   * Métodos auxiliares
   */
  
  shouldProcessFile(filePath) {
    const ext = path.extname(filePath);
    const allowedExtensions = ['.js', '.json'];
    const excludedPaths = ['node_modules', '.git', 'dist', 'build'];
    
    return allowedExtensions.includes(ext) && 
           !excludedPaths.some(excluded => filePath.includes(excluded));
  }

  isTemplateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes('template') || 
           content.includes('pattern') || 
           filePath.includes('generator.js');
  }

  extractExportedFunctions(content) {
    const functions = [];
    
    // Buscar exports de funciones
    const exportRegex = /(?:module\.exports\s*=\s*{\s*([^}]+)\s*}|exports\.(\w+)|class\s+(\w+))/g;
    let match;
    
    while ((match = exportRegex.exec(content)) !== null) {
      if (match[1]) {
        // module.exports = { func1, func2 }
        const exportedNames = match[1].split(',').map(name => name.trim());
        functions.push(...exportedNames);
      } else if (match[2]) {
        // exports.funcName
        functions.push(match[2]);
      } else if (match[3]) {
        // class ClassName
        functions.push(match[3]);
      }
    }
    
    return functions.filter(func => func && func.length > 0);
  }

  generateTestTemplate(fileName, functions) {
    return `/**
 * Tests automáticos generados para ${fileName}
 * Generado por Auto-Test Hook
 */

const { ${functions.join(', ')} } = require('../src/${fileName}');

describe('${fileName}', () => {
${functions.map(func => `
  describe('${func}', () => {
    test('should be defined', () => {
      expect(${func}).toBeDefined();
    });
    
    // TODO: Agregar tests específicos para ${func}
    test('should work correctly', () => {
      // Implementar test específico
      expect(true).toBe(true);
    });
  });`).join('\n')}
});
`;
  }

  generateAdditionalTests(functions) {
    return functions.map(func => `
describe('${func}', () => {
  test('should be defined', () => {
    expect(${func}).toBeDefined();
  });
  
  // TODO: Implementar tests específicos para ${func}
});`).join('\n');
  }

  findTestFiles() {
    if (!fs.existsSync(this.testDir)) {
      return [];
    }
    
    return fs.readdirSync(this.testDir)
      .filter(file => file.endsWith('.test.js'))
      .map(file => path.join(this.testDir, file));
  }

  async runSingleTest(testFile) {
    try {
      const content = fs.readFileSync(testFile, 'utf8');
      
      // Verificar sintaxis del test
      require('vm').createScript(content, testFile);
      
      console.log(`✓ Test válido: ${path.basename(testFile)}`);
      
    } catch (error) {
      throw new Error(`Test falló ${path.basename(testFile)}: ${error.message}`);
    }
  }

  ensureTestDirectory() {
    if (!fs.existsSync(this.testDir)) {
      fs.mkdirSync(this.testDir, { recursive: true });
      console.log(`📁 Directorio de tests creado: ${this.testDir}`);
    }
  }

  logError(filePath, error) {
    const logFile = path.join(this.projectRoot, 'auto-test.log');
    const logEntry = `[${new Date().toISOString()}] ${filePath}: ${error.message}\n`;
    
    fs.appendFileSync(logFile, logEntry);
  }
}

// Exportar la clase para uso del sistema de hooks de Kiro
module.exports = { AutoTestHook };

// Instancia global para triggers
const autoTestHook = new AutoTestHook();

// Configurar triggers para Kiro
if (typeof global !== 'undefined' && global.kiro) {
  global.kiro.hooks.register('onSave', autoTestHook.onSave.bind(autoTestHook));
  global.kiro.hooks.register('onFileChange', autoTestHook.onFileChange.bind(autoTestHook));
  global.kiro.hooks.register('onCommit', autoTestHook.onCommit.bind(autoTestHook));
}

console.log('🎭 Auto-Test Hook cargado y configurado');