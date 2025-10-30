const express = require('express');
const cors = require('cors');
const path = require('path');
const { CalaveriteGenerator } = require('./generator');
const { DataManager } = require('./data-manager');
const { CalaveriteValidator } = require('./validator');
const { AnalyticsManager } = require('./analytics-manager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Instancias
const generator = new CalaveriteGenerator();
const dataManager = new DataManager();
const validator = new CalaveriteValidator();
const analyticsManager = new AnalyticsManager(dataManager);

// Rutas API
app.post('/api/generate', (req, res) => {
  try {
    const { name, profession, trait, templateId } = req.body;
    const userAgent = req.get('User-Agent') || 'unknown';
    
    // Validación avanzada con el validator
    const validation = validator.validateInput({ name, profession, trait, templateId });
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false,
        error: 'Datos de entrada no válidos',
        message: 'Bad Request: ' + validation.errors.join(', '),
        validationErrors: validation.errors
      });
    }

    // Usar datos sanitizados
    const sanitizedData = validation.sanitizedData;
    
    const calaverita = templateId 
      ? generator.generateWithTemplate(
          sanitizedData.name, 
          sanitizedData.profession, 
          sanitizedData.trait, 
          sanitizedData.templateId, 
          userAgent
        )
      : generator.generate(
          sanitizedData.name, 
          sanitizedData.profession, 
          sanitizedData.trait, 
          userAgent
        );
      
    const saved = dataManager.saveCalaverita(calaverita);
    
    // Track analytics
    if (saved) {
      analyticsManager.trackGeneration(calaverita, userAgent);
    }
    
    if (saved) {
      res.json({ 
        success: true, 
        data: calaverita,
        message: 'Calaverita generada exitosamente'
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Error guardando calaverita',
        message: 'Server Error: No se pudo guardar la calaverita'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: Error interno del servidor'
    });
  }
});

app.get('/api/templates', (req, res) => {
  try {
    const templates = generator.getTemplates();
    res.json({ 
      success: true,
      data: templates,
      message: 'Plantillas obtenidas exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: No se pudieron obtener las plantillas'
    });
  }
});



app.get('/api/history', (req, res) => {
  try {
    const history = dataManager.getHistory();
    res.json({ 
      success: true,
      data: history,
      message: 'Historial obtenido exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: No se pudo obtener el historial'
    });
  }
});

app.get('/api/history/search', (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro query es requerido',
        message: 'Bad Request: Falta el término de búsqueda'
      });
    }
    
    const history = dataManager.getHistory();
    const searchTerm = query.toLowerCase().trim();
    
    // Buscar en nombre, profesión y contenido de la calaverita
    const filteredHistory = history.filter(calaverita => {
      const name = (calaverita.name || '').toLowerCase();
      const profession = (calaverita.profession || '').toLowerCase();
      const text = (calaverita.text || '').toLowerCase();
      const trait = (calaverita.trait || '').toLowerCase();
      const templateName = (calaverita.templateName || '').toLowerCase();
      
      return name.includes(searchTerm) || 
             profession.includes(searchTerm) || 
             text.includes(searchTerm) ||
             trait.includes(searchTerm) ||
             templateName.includes(searchTerm);
    });
    
    res.json({
      success: true,
      data: filteredHistory,
      searchTerm: query,
      totalResults: filteredHistory.length,
      totalHistory: history.length,
      message: `Búsqueda completada: ${filteredHistory.length} resultado(s) encontrado(s)`
    });
    
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: Error realizando búsqueda'
    });
  }
});

app.delete('/api/history', (req, res) => {
  try {
    const cleared = dataManager.clearHistory();
    if (cleared) {
      res.json({ 
        success: true, 
        data: null,
        message: 'Historial limpiado exitosamente' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Error limpiando historial',
        message: 'Server Error: No se pudo limpiar el historial'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: Error interno del servidor'
    });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = dataManager.getHistoryStats();
    res.json({ 
      success: true,
      data: stats,
      message: 'Estadísticas obtenidas exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: No se pudieron obtener las estadísticas'
    });
  }
});

app.get('/api/validation/rules', (req, res) => {
  try {
    const rules = validator.getValidationRules();
    res.json({ 
      success: true,
      data: rules,
      message: 'Reglas de validación obtenidas exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: No se pudieron obtener las reglas de validación'
    });
  }
});

app.post('/api/validation/field', (req, res) => {
  try {
    const { fieldName, value } = req.body;
    
    if (!fieldName) {
      return res.status(400).json({ 
        success: false,
        error: 'Campo fieldName es requerido',
        message: 'Bad Request: Falta el nombre del campo'
      });
    }

    const validation = validator.validateFieldRealTime(fieldName, value);
    res.json({ 
      success: true,
      data: validation,
      message: 'Validación de campo completada'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: Error validando campo'
    });
  }
});

app.post('/api/validation/contextual', (req, res) => {
  try {
    const { name, profession, trait, templateId } = req.body;
    
    // Validación completa contextual
    const validation = validator.validateInput({ name, profession, trait, templateId });
    
    // Validaciones adicionales específicas por plantilla
    let contextualMessages = [];
    
    if (templateId) {
      const template = generator.getTemplates().find(t => t.id === templateId);
      if (template) {
        // Validaciones específicas por tipo de plantilla
        if (templateId === 'clasica' || templateId === 'respetado') {
          if (!trait) {
            contextualMessages.push('Esta plantilla funciona mejor con una característica especial que destaque a la persona');
          } else if (trait) {
            const traitValidation = validator.validateTraitType(trait, 'positive');
            if (traitValidation.warnings && traitValidation.warnings.length > 0) {
              contextualMessages.push(...traitValidation.warnings);
            }
          }
        }
        
        if (templateId === 'trabajador') {
          if (profession && trait && trait.toLowerCase().includes('trabajador')) {
            contextualMessages.push('Sugerencia: Evita repetir "trabajador" en la característica, ya que esta plantilla ya celebra el trabajo');
          }
        }
        
        if (templateId === 'catrina') {
          contextualMessages.push('La plantilla Catrina es elegante y funciona bien con cualquier profesión');
        }
      }
    }

    res.json({ 
      success: true,
      data: {
        ...validation,
        contextualMessages: contextualMessages,
        templateSpecific: templateId ? true : false
      },
      message: 'Validación contextual completada'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Server Error: Error en validación contextual'
    });
  }
});

app.post('/api/export', (req, res) => {
  try {
    const history = dataManager.getHistory();
    const stats = dataManager.getHistoryStats();
    
    // Crear datos de exportación con metadatos
    const exportData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        totalCalaveritas: history.length,
        generatorVersion: '2.0',
        exportFormat: 'JSON'
      },
      statistics: stats,
      calaveritas: history
    };
    
    // Generar nombre de archivo con fecha
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const filename = `calaveritas-historial-${dateStr}-${timeStr}.json`;
    
    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    
    res.json({
      success: true,
      data: exportData,
      filename: filename,
      message: 'Historial exportado exitosamente'
    });
    
  } catch (error) {
    console.error('Error exportando historial:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: No se pudo exportar el historial'
    });
  }
});

// MCP Integration Endpoints
app.get('/api/mcp/status', (req, res) => {
  try {
    const mcpStatus = generator.getMCPStatus();
    res.json({
      success: true,
      data: mcpStatus,
      message: 'Estado MCP obtenido exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: No se pudo obtener el estado MCP'
    });
  }
});

app.post('/api/mcp/validate-template', async (req, res) => {
  try {
    const { template } = req.body;
    
    if (!template || !template.pattern) {
      return res.status(400).json({
        success: false,
        error: 'Template con pattern es requerido',
        message: 'Bad Request: Falta la plantilla a validar'
      });
    }
    
    const validation = await generator.validateTemplateWithMCP(template);
    res.json({
      success: true,
      data: validation,
      message: 'Validación MCP completada'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: Error en validación MCP'
    });
  }
});

app.post('/api/mcp/generate-template', async (req, res) => {
  try {
    const { theme, style = 'tradicional' } = req.body;
    
    if (!theme) {
      return res.status(400).json({
        success: false,
        error: 'Theme es requerido',
        message: 'Bad Request: Falta el tema para generar plantilla'
      });
    }
    
    const newTemplate = await generator.generateTemplateWithMCP(theme, style);
    res.json({
      success: true,
      data: newTemplate,
      message: 'Plantilla generada con MCP exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: Error generando plantilla con MCP'
    });
  }
});

app.post('/api/mcp/generate-enhanced', async (req, res) => {
  try {
    const { name, profession, trait, templateId } = req.body;
    const userAgent = req.get('User-Agent') || 'unknown';
    
    // Validación básica
    const validation = validator.validateInput({ name, profession, trait, templateId });
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Datos de entrada no válidos',
        message: 'Bad Request: ' + validation.errors.join(', '),
        validationErrors: validation.errors
      });
    }
    
    // Generar con contexto MCP mejorado
    const calaverita = await generator.generateWithMCPContext(
      validation.sanitizedData.name,
      validation.sanitizedData.profession,
      validation.sanitizedData.trait,
      validation.sanitizedData.templateId
    );
    
    // Guardar con metadatos MCP
    const saved = dataManager.saveCalaverita(calaverita);
    
    // Track analytics with MCP context
    if (saved) {
      analyticsManager.trackGeneration(calaverita, userAgent);
    }
    
    if (saved) {
      res.json({
        success: true,
        data: calaverita,
        message: 'Calaverita generada con contexto MCP mejorado'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error guardando calaverita',
        message: 'Server Error: No se pudo guardar la calaverita'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: Error en generación MCP mejorada'
    });
  }
});

// Analytics and Monitoring Endpoints
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const dashboard = analyticsManager.getDashboardData();
    res.json({
      success: true,
      data: dashboard,
      message: 'Dashboard de analytics obtenido exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: No se pudo obtener el dashboard de analytics'
    });
  }
});

app.get('/api/analytics/templates', async (req, res) => {
  try {
    const templateAnalytics = await analyticsManager.getTemplateAnalytics();
    res.json({
      success: true,
      data: templateAnalytics,
      message: 'Analytics de plantillas obtenido exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: No se pudo obtener analytics de plantillas'
    });
  }
});

app.get('/api/analytics/realtime', (req, res) => {
  try {
    const realTimeMetrics = analyticsManager.getRealTimeMetrics();
    res.json({
      success: true,
      data: realTimeMetrics,
      message: 'Métricas en tiempo real obtenidas exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: No se pudieron obtener métricas en tiempo real'
    });
  }
});

app.get('/api/analytics/report', async (req, res) => {
  try {
    const report = await analyticsManager.generateAnalyticsReport();
    res.json({
      success: true,
      data: report,
      message: 'Reporte de analytics generado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: No se pudo generar el reporte de analytics'
    });
  }
});

app.post('/api/analytics/export', async (req, res) => {
  try {
    const { format = 'json', includeInsights = true } = req.body;
    
    const report = await analyticsManager.generateAnalyticsReport();
    
    // Generate filename with timestamp
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `analytics-report-${dateStr}-${timeStr}.${format}`;
    
    // Configure headers for download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    
    const exportData = {
      exportInfo: {
        exportDate: now.toISOString(),
        format: format,
        includeInsights: includeInsights,
        generatedBy: 'MCP Analytics System'
      },
      report: includeInsights ? report : {
        ...report,
        insights: undefined,
        recommendations: undefined
      }
    };
    
    res.json({
      success: true,
      data: exportData,
      filename: filename,
      message: 'Reporte de analytics exportado exitosamente'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: No se pudo exportar el reporte de analytics'
    });
  }
});

// MCP Analytics Integration Endpoints
app.get('/api/mcp/analytics/status', (req, res) => {
  try {
    const mcpStatus = generator.getMCPStatus();
    const analyticsStatus = {
      mcpEnabled: mcpStatus.mcpEnabled,
      analyticsActive: true,
      monitoringFeatures: [
        'Template usage tracking',
        'Quality metrics with MCP validation',
        'Real-time generation monitoring',
        'Cultural and poetic scoring',
        'User behavior analytics'
      ],
      integrationHealth: mcpStatus.mcpEnabled ? 'optimal' : 'basic'
    };
    
    res.json({
      success: true,
      data: analyticsStatus,
      message: 'Estado de analytics MCP obtenido exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: No se pudo obtener el estado de analytics MCP'
    });
  }
});

app.post('/api/mcp/analytics/validate-quality', async (req, res) => {
  try {
    const { templateId } = req.body;
    
    if (!templateId) {
      return res.status(400).json({
        success: false,
        error: 'templateId es requerido',
        message: 'Bad Request: Falta el ID de la plantilla'
      });
    }
    
    // Get template from generator
    const templates = generator.getTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Plantilla no encontrada',
        message: 'Not Found: La plantilla especificada no existe'
      });
    }
    
    // Validate with MCP
    const validation = await generator.validateTemplateWithMCP({
      id: template.id,
      name: template.name,
      pattern: `Plantilla ${template.name}` // Simplified for demo
    });
    
    res.json({
      success: true,
      data: {
        templateId: templateId,
        templateName: template.name,
        validation: validation,
        qualityScore: Math.round((validation.culturalScore + validation.poeticScore) / 2)
      },
      message: 'Validación de calidad MCP completada'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server Error: Error en validación de calidad MCP'
    });
  }
});

// Servir la aplicación web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎭 Generador ejecutándose en http://localhost:${PORT}`);
});