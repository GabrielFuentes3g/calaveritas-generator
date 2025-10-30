/**
 * Agent Hook: Auto-Documentation
 * 
 * Este hook se ejecuta automáticamente para:
 * - Actualizar README automáticamente al agregar plantillas
 * - Generar documentación API automática
 * - Validar enlaces y referencias en documentación
 * 
 * Requirements: 3.4
 */

const fs = require('fs');
const path = require('path');

class AutoDocsHook {
  constructor() {
    this.projectRoot = process.cwd();
    this.readmePath = path.join(this.projectRoot, 'README.md');
    this.srcDir = path.join(this.projectRoot, 'src');
    this.docsDir = path.join(this.projectRoot, 'docs');
    
    // Configuración de documentación
    this.config = {
      apiDocFile: path.join(this.docsDir, 'api.md'),
      templatesSection: '## 🎭 Plantillas Disponibles',
      apiSection: '## 📡 API Reference',
      installSection: '## 🚀 Instalación y Uso'
    };
    
    this.ensureDocsDirectory();
  }

  /**
   * Trigger principal: onTemplateAdd
   * Se ejecuta cuando se agregan nuevas plantillas
   */
  async onTemplateAdd(templateData) {
    console.log(`📝 Auto-Docs: Actualizando documentación para nueva plantilla "${templateData.name}"`);
    
    try {
      // 1. Actualizar sección de plantillas en README
      await this.updateTemplatesInReadme();
      
      // 2. Generar documentación de la nueva plantilla
      await this.generateTemplateDoc(templateData);
      
      // 3. Actualizar índice de documentación
      await this.updateDocsIndex();
      
      console.log(`✅ Documentación actualizada para plantilla "${templateData.name}"`);
      
    } catch (error) {
      console.error(`❌ Error actualizando documentación: ${error.message}`);
    }
  }

  /**
   * Trigger: onApiChange
   * Se ejecuta cuando cambian los endpoints de la API
   */
  async onApiChange(filePath) {
    console.log(`📡 Auto-Docs: Detectado cambio en API - ${path.basename(filePath)}`);
    
    try {
      // 1. Extraer endpoints del código
      const endpoints = await this.extractApiEndpoints(filePath);
      
      // 2. Generar documentación API
      await this.generateApiDocumentation(endpoints);
      
      // 3. Actualizar README con nueva API
      await this.updateApiInReadme(endpoints);
      
      console.log(`✅ Documentación API actualizada`);
      
    } catch (error) {
      console.error(`❌ Error actualizando documentación API: ${error.message}`);
    }
  }

  /**
   * Trigger: onFileChange
   * Validar enlaces y referencias en documentación
   */
  async onDocumentationChange(filePath) {
    if (!filePath.endsWith('.md')) {
      return;
    }
    
    console.log(`📖 Auto-Docs: Validando documentación - ${path.basename(filePath)}`);
    
    try {
      // 1. Validar enlaces internos
      await this.validateInternalLinks(filePath);
      
      // 2. Validar referencias a código
      await this.validateCodeReferences(filePath);
      
      // 3. Verificar formato y estructura
      await this.validateDocumentStructure(filePath);
      
      console.log(`✅ Documentación validada: ${path.basename(filePath)}`);
      
    } catch (error) {
      console.error(`❌ Error validando documentación: ${error.message}`);
    }
  }

  /**
   * Actualizar sección de plantillas en README
   */
  async updateTemplatesInReadme() {
    try {
      // Leer plantillas actuales del generador
      const generatorPath = path.join(this.srcDir, 'generator.js');
      const templates = await this.extractTemplatesFromCode(generatorPath);
      
      // Generar nueva sección de plantillas
      const templatesSection = this.generateTemplatesSection(templates);
      
      // Actualizar README
      await this.updateReadmeSection(this.config.templatesSection, templatesSection);
      
      console.log(`✓ Sección de plantillas actualizada en README`);
      
    } catch (error) {
      throw new Error(`Error actualizando plantillas en README: ${error.message}`);
    }
  }

  /**
   * Extraer plantillas del código del generador
   */
  async extractTemplatesFromCode(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const templates = [];
    
    // Buscar definición de templates en el constructor
    const templateRegex = /{\s*id:\s*['"`]([^'"`]+)['"`],\s*name:\s*['"`]([^'"`]+)['"`],\s*pattern:\s*['"`]([^'"`]+)['"`],\s*requiresTrait:\s*(true|false),\s*description:\s*['"`]([^'"`]+)['"`]/g;
    
    let match;
    while ((match = templateRegex.exec(content)) !== null) {
      templates.push({
        id: match[1],
        name: match[2],
        pattern: match[3].substring(0, 50) + '...', // Truncar para documentación
        requiresTrait: match[4] === 'true',
        description: match[5]
      });
    }
    
    return templates;
  }

  /**
   * Generar sección de plantillas para README
   */
  generateTemplatesSection(templates) {
    let section = `## 🎭 Plantillas Disponibles\n\n`;
    section += `El generador incluye ${templates.length} plantillas únicas:\n\n`;
    
    templates.forEach((template, index) => {
      section += `### ${index + 1}. ${template.name} (\`${template.id}\`)\n\n`;
      section += `**Descripción:** ${template.description}\n\n`;
      section += `**Requiere característica:** ${template.requiresTrait ? '✅ Sí' : '❌ No'}\n\n`;
      section += `**Ejemplo de patrón:** "${template.pattern}"\n\n`;
      section += `---\n\n`;
    });
    
    section += `### Uso de Plantillas\n\n`;
    section += `\`\`\`javascript\n`;
    section += `// Generar con plantilla específica\n`;
    section += `const calaverita = generator.generateWithTemplate(\n`;
    section += `  'Juan',      // nombre\n`;
    section += `  'doctor',    // profesión\n`;
    section += `  'alegre',    // característica (opcional según plantilla)\n`;
    section += `  'clasica'    // ID de plantilla\n`;
    section += `);\n`;
    section += `\`\`\`\n\n`;
    
    return section;
  }

  /**
   * Extraer endpoints de la API del código
   */
  async extractApiEndpoints(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const endpoints = [];
    
    // Buscar definiciones de rutas Express
    const routeRegex = /app\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    
    let match;
    while ((match = routeRegex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2];
      
      // Extraer comentarios de documentación si existen
      const lineIndex = content.substring(0, match.index).split('\n').length - 1;
      const lines = content.split('\n');
      let description = '';
      
      // Buscar comentario en líneas anteriores
      for (let i = lineIndex - 1; i >= Math.max(0, lineIndex - 5); i--) {
        const line = lines[i].trim();
        if (line.startsWith('//') || line.startsWith('*')) {
          description = line.replace(/^\/\/\s*|\*\s*/, '').trim();
          break;
        }
      }
      
      endpoints.push({
        method,
        path,
        description: description || 'Endpoint sin descripción'
      });
    }
    
    return endpoints;
  }

  /**
   * Generar documentación completa de la API
   */
  async generateApiDocumentation(endpoints) {
    let apiDoc = `# API Documentation\n\n`;
    apiDoc += `Documentación automática generada el ${new Date().toLocaleDateString('es-MX')}\n\n`;
    apiDoc += `## Endpoints Disponibles\n\n`;
    
    endpoints.forEach(endpoint => {
      apiDoc += `### ${endpoint.method} ${endpoint.path}\n\n`;
      apiDoc += `**Descripción:** ${endpoint.description}\n\n`;
      
      // Agregar ejemplos específicos según el endpoint
      if (endpoint.path.includes('/generate')) {
        apiDoc += `**Ejemplo de Request:**\n`;
        apiDoc += `\`\`\`json\n`;
        apiDoc += `{\n`;
        apiDoc += `  "name": "Juan Pérez",\n`;
        apiDoc += `  "profession": "doctor",\n`;
        apiDoc += `  "trait": "alegre",\n`;
        apiDoc += `  "templateId": "clasica"\n`;
        apiDoc += `}\n`;
        apiDoc += `\`\`\`\n\n`;
        
        apiDoc += `**Ejemplo de Response:**\n`;
        apiDoc += `\`\`\`json\n`;
        apiDoc += `{\n`;
        apiDoc += `  "success": true,\n`;
        apiDoc += `  "data": {\n`;
        apiDoc += `    "id": "1635789123456",\n`;
        apiDoc += `    "name": "Juan Pérez",\n`;
        apiDoc += `    "profession": "doctor",\n`;
        apiDoc += `    "trait": "alegre",\n`;
        apiDoc += `    "templateId": "clasica",\n`;
        apiDoc += `    "templateName": "Clásica",\n`;
        apiDoc += `    "text": "Aquí yace Juan Pérez, doctor querido...",\n`;
        apiDoc += `    "date": "01/11/2024",\n`;
        apiDoc += `    "metadata": {\n`;
        apiDoc += `      "wordCount": 25,\n`;
        apiDoc += `      "generationTime": 15,\n`;
        apiDoc += `      "userAgent": "browser"\n`;
        apiDoc += `    }\n`;
        apiDoc += `  }\n`;
        apiDoc += `}\n`;
        apiDoc += `\`\`\`\n\n`;
      }
      
      if (endpoint.path.includes('/history')) {
        apiDoc += `**Ejemplo de Response:**\n`;
        apiDoc += `\`\`\`json\n`;
        apiDoc += `{\n`;
        apiDoc += `  "success": true,\n`;
        apiDoc += `  "data": [\n`;
        apiDoc += `    {\n`;
        apiDoc += `      "id": "1635789123456",\n`;
        apiDoc += `      "name": "Juan Pérez",\n`;
        apiDoc += `      "text": "Aquí yace Juan Pérez...",\n`;
        apiDoc += `      "date": "01/11/2024"\n`;
        apiDoc += `    }\n`;
        apiDoc += `  ]\n`;
        apiDoc += `}\n`;
        apiDoc += `\`\`\`\n\n`;
      }
      
      apiDoc += `---\n\n`;
    });
    
    // Escribir documentación API
    fs.writeFileSync(this.config.apiDocFile, apiDoc);
    console.log(`✓ Documentación API generada: ${this.config.apiDocFile}`);
  }

  /**
   * Actualizar sección de API en README
   */
  async updateApiInReadme(endpoints) {
    let apiSection = `## 📡 API Reference\n\n`;
    apiSection += `La aplicación expone los siguientes endpoints REST:\n\n`;
    
    endpoints.forEach(endpoint => {
      apiSection += `- **${endpoint.method}** \`${endpoint.path}\` - ${endpoint.description}\n`;
    });
    
    apiSection += `\n📖 **Documentación completa:** [docs/api.md](docs/api.md)\n\n`;
    
    await this.updateReadmeSection(this.config.apiSection, apiSection);
    console.log(`✓ Sección API actualizada en README`);
  }

  /**
   * Validar enlaces internos en documentación
   */
  async validateInternalLinks(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Buscar enlaces markdown [texto](enlace)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const linkText = match[1];
      const linkPath = match[2];
      
      // Validar enlaces internos (no URLs externas)
      if (!linkPath.startsWith('http') && !linkPath.startsWith('#')) {
        const fullPath = path.resolve(path.dirname(filePath), linkPath);
        
        if (!fs.existsSync(fullPath)) {
          issues.push(`Enlace roto: "${linkText}" -> ${linkPath}`);
        }
      }
    }
    
    // Buscar referencias a archivos con #[[file:...]]
    const fileRefRegex = /#\[\[file:([^\]]+)\]\]/g;
    while ((match = fileRefRegex.exec(content)) !== null) {
      const referencedFile = match[1];
      const fullPath = path.resolve(this.projectRoot, referencedFile);
      
      if (!fs.existsSync(fullPath)) {
        issues.push(`Referencia de archivo rota: ${referencedFile}`);
      }
    }
    
    if (issues.length > 0) {
      console.log(`⚠️  Enlaces rotos en ${path.basename(filePath)}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✓ Enlaces validados: ${path.basename(filePath)}`);
    }
  }

  /**
   * Validar referencias a código en documentación
   */
  async validateCodeReferences(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Buscar bloques de código con referencias a funciones
    const codeBlockRegex = /```(?:javascript|js)\n([\s\S]*?)\n```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const codeBlock = match[1];
      
      // Buscar referencias a clases y funciones del proyecto
      const classRefs = codeBlock.match(/new\s+(\w+)/g);
      const functionRefs = codeBlock.match(/(\w+)\(/g);
      
      if (classRefs) {
        classRefs.forEach(ref => {
          const className = ref.replace('new ', '');
          if (!this.classExistsInProject(className)) {
            issues.push(`Referencia a clase inexistente: ${className}`);
          }
        });
      }
      
      if (functionRefs) {
        functionRefs.forEach(ref => {
          const functionName = ref.replace('(', '');
          // Solo validar funciones que parecen ser del proyecto (no built-ins)
          if (functionName.length > 3 && !this.isBuiltInFunction(functionName)) {
            if (!this.functionExistsInProject(functionName)) {
              issues.push(`Referencia a función inexistente: ${functionName}`);
            }
          }
        });
      }
    }
    
    if (issues.length > 0) {
      console.log(`⚠️  Referencias de código en ${path.basename(filePath)}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✓ Referencias de código validadas: ${path.basename(filePath)}`);
    }
  }

  /**
   * Validar estructura de documentos markdown
   */
  async validateDocumentStructure(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    const lines = content.split('\n');
    
    // Validar que tenga título principal
    const hasMainTitle = lines.some(line => line.startsWith('# '));
    if (!hasMainTitle) {
      issues.push('Documento debe tener un título principal (# Título)');
    }
    
    // Validar estructura de headers (no saltar niveles)
    let lastHeaderLevel = 0;
    lines.forEach((line, index) => {
      const headerMatch = line.match(/^(#{1,6})\s/);
      if (headerMatch) {
        const currentLevel = headerMatch[1].length;
        if (currentLevel > lastHeaderLevel + 1) {
          issues.push(`Línea ${index + 1}: Salto de nivel de header (de ${lastHeaderLevel} a ${currentLevel})`);
        }
        lastHeaderLevel = currentLevel;
      }
    });
    
    // Validar que los bloques de código tengan lenguaje especificado
    const codeBlockRegex = /^```(\w*)$/gm;
    let match;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (!match[1]) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        issues.push(`Línea ${lineNumber}: Bloque de código sin lenguaje especificado`);
      }
    }
    
    if (issues.length > 0) {
      console.log(`⚠️  Estructura de documento en ${path.basename(filePath)}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✓ Estructura de documento validada: ${path.basename(filePath)}`);
    }
  }

  /**
   * Actualizar sección específica en README
   */
  async updateReadmeSection(sectionTitle, newContent) {
    if (!fs.existsSync(this.readmePath)) {
      console.log(`⚠️  README.md no existe, creando uno nuevo`);
      await this.createBasicReadme();
    }
    
    let content = fs.readFileSync(this.readmePath, 'utf8');
    
    // Buscar la sección existente
    const sectionRegex = new RegExp(`(${sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?)(?=\\n## |$)`, 's');
    
    if (sectionRegex.test(content)) {
      // Reemplazar sección existente
      content = content.replace(sectionRegex, newContent);
    } else {
      // Agregar nueva sección al final
      content += '\n\n' + newContent;
    }
    
    fs.writeFileSync(this.readmePath, content);
  }

  /**
   * Crear README básico si no existe
   */
  async createBasicReadme() {
    const basicReadme = `# 🎭 Generador de Calaveritas del Día de Muertos

Aplicación web para generar calaveritas personalizadas del Día de Muertos.

## 🚀 Instalación y Uso

\`\`\`bash
npm install
npm start
\`\`\`

La aplicación estará disponible en http://localhost:8080

## 🎭 Plantillas Disponibles

_Esta sección se actualiza automáticamente_

## 📡 API Reference

_Esta sección se actualiza automáticamente_

## 🛠️ Desarrollo

Este proyecto utiliza el stack completo de Kiro para desarrollo automatizado.

---

Generado automáticamente por Auto-Docs Hook
`;
    
    fs.writeFileSync(this.readmePath, basicReadme);
    console.log(`✓ README.md básico creado`);
  }

  /**
   * Actualizar índice de documentación
   */
  async updateDocsIndex() {
    const indexPath = path.join(this.docsDir, 'index.md');
    
    // Buscar todos los archivos .md en docs/
    const docFiles = fs.readdirSync(this.docsDir)
      .filter(file => file.endsWith('.md') && file !== 'index.md')
      .sort();
    
    let indexContent = `# 📚 Documentación del Proyecto\n\n`;
    indexContent += `Índice automático generado el ${new Date().toLocaleDateString('es-MX')}\n\n`;
    indexContent += `## Documentos Disponibles\n\n`;
    
    docFiles.forEach(file => {
      const fileName = path.basename(file, '.md');
      const title = fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/-/g, ' ');
      indexContent += `- [${title}](${file})\n`;
    });
    
    indexContent += `\n## Enlaces Útiles\n\n`;
    indexContent += `- [README Principal](../README.md)\n`;
    indexContent += `- [Código Fuente](../src/)\n`;
    indexContent += `- [Tests](../tests/)\n`;
    
    fs.writeFileSync(indexPath, indexContent);
    console.log(`✓ Índice de documentación actualizado`);
  }

  /**
   * Generar documentación específica para una plantilla
   */
  async generateTemplateDoc(templateData) {
    const templateDocPath = path.join(this.docsDir, `template-${templateData.id}.md`);
    
    let doc = `# Plantilla: ${templateData.name}\n\n`;
    doc += `**ID:** \`${templateData.id}\`\n\n`;
    doc += `**Descripción:** ${templateData.description}\n\n`;
    doc += `**Requiere característica:** ${templateData.requiresTrait ? 'Sí' : 'No'}\n\n`;
    doc += `## Patrón\n\n`;
    doc += `\`\`\`\n${templateData.pattern}\`\`\`\n\n`;
    doc += `## Ejemplos de Uso\n\n`;
    doc += `### JavaScript\n\n`;
    doc += `\`\`\`javascript\n`;
    doc += `const calaverita = generator.generateWithTemplate(\n`;
    doc += `  'Juan Pérez',\n`;
    doc += `  'doctor',\n`;
    doc += `  ${templateData.requiresTrait ? "'alegre'" : 'null'},\n`;
    doc += `  '${templateData.id}'\n`;
    doc += `);\n`;
    doc += `\`\`\`\n\n`;
    doc += `### API REST\n\n`;
    doc += `\`\`\`bash\n`;
    doc += `curl -X POST http://localhost:8080/api/generate \\\n`;
    doc += `  -H "Content-Type: application/json" \\\n`;
    doc += `  -d '{\n`;
    doc += `    "name": "Juan Pérez",\n`;
    doc += `    "profession": "doctor",\n`;
    doc += `    ${templateData.requiresTrait ? '"trait": "alegre",' : ''}\n`;
    doc += `    "templateId": "${templateData.id}"\n`;
    doc += `  }'\n`;
    doc += `\`\`\`\n\n`;
    doc += `---\n\n`;
    doc += `_Documentación generada automáticamente el ${new Date().toLocaleDateString('es-MX')}_\n`;
    
    fs.writeFileSync(templateDocPath, doc);
    console.log(`✓ Documentación de plantilla generada: ${templateDocPath}`);
  }

  /**
   * Métodos auxiliares
   */
  
  ensureDocsDirectory() {
    if (!fs.existsSync(this.docsDir)) {
      fs.mkdirSync(this.docsDir, { recursive: true });
      console.log(`📁 Directorio docs/ creado`);
    }
  }

  classExistsInProject(className) {
    // Buscar la clase en archivos del proyecto
    const srcFiles = this.getAllJSFiles(this.srcDir);
    
    for (const file of srcFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes(`class ${className}`) || content.includes(`${className}:`)) {
        return true;
      }
    }
    
    return false;
  }

  functionExistsInProject(functionName) {
    // Lista de funciones built-in comunes que no necesitan validación
    const builtIns = ['console', 'require', 'module', 'exports', 'JSON', 'Date', 'Math', 'Object', 'Array'];
    if (builtIns.includes(functionName)) {
      return true;
    }
    
    const srcFiles = this.getAllJSFiles(this.srcDir);
    
    for (const file of srcFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes(`function ${functionName}`) || 
          content.includes(`${functionName}(`) ||
          content.includes(`${functionName}:`)) {
        return true;
      }
    }
    
    return false;
  }

  isBuiltInFunction(functionName) {
    const builtIns = ['log', 'error', 'warn', 'info', 'parse', 'stringify', 'push', 'pop', 'map', 'filter', 'reduce'];
    return builtIns.includes(functionName);
  }

  getAllJSFiles(dir) {
    const files = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getAllJSFiles(fullPath));
      } else if (item.endsWith('.js')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
}

// Exportar la clase para uso del sistema de hooks de Kiro
module.exports = { AutoDocsHook };

// Instancia global para triggers
const autoDocsHook = new AutoDocsHook();

// Configurar triggers para Kiro
if (typeof global !== 'undefined' && global.kiro) {
  global.kiro.hooks.register('onTemplateAdd', autoDocsHook.onTemplateAdd.bind(autoDocsHook));
  global.kiro.hooks.register('onApiChange', autoDocsHook.onApiChange.bind(autoDocsHook));
  global.kiro.hooks.register('onDocumentationChange', autoDocsHook.onDocumentationChange.bind(autoDocsHook));
}

console.log('📝 Auto-Docs Hook cargado y configurado');