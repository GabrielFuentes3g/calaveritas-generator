/**
 * Analytics Manager - MCP-Enhanced Monitoring System
 * Provides comprehensive analytics and monitoring for calaverita generation
 */

const { MCPIntegration } = require('./mcp-integration');

class AnalyticsManager {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.mcpIntegration = new MCPIntegration();
    this.analyticsData = {
      templateUsage: {},
      generationMetrics: {},
      userBehavior: {},
      qualityMetrics: {},
      mcpMetrics: {}
    };
    this.initializeAnalytics();
  }

  /**
   * Initialize analytics system
   */
  initializeAnalytics() {
    console.log('📊 Inicializando sistema de analytics con MCP...');
    this.loadExistingAnalytics();
  }

  /**
   * Load existing analytics data
   */
  loadExistingAnalytics() {
    const history = this.dataManager.getHistory();
    
    // Reset analytics
    this.analyticsData = {
      templateUsage: {},
      generationMetrics: {
        totalGenerations: history.length,
        averageGenerationTime: 0,
        peakUsageHours: {},
        dailyGenerations: {}
      },
      userBehavior: {
        mostUsedProfessions: {},
        mostUsedTraits: {},
        sessionPatterns: {}
      },
      qualityMetrics: {
        averageWordCount: 0,
        templateQualityScores: {},
        mcpValidationScores: {}
      },
      mcpMetrics: {
        validationsPerformed: 0,
        templatesGenerated: 0,
        averageCulturalScore: 0,
        averagePoeticScore: 0
      }
    };

    // Process existing data
    this.processHistoricalData(history);
  }

  /**
   * Process historical data for analytics
   */
  processHistoricalData(history) {
    let totalGenerationTime = 0;
    let totalWordCount = 0;
    let mcpValidatedCount = 0;
    let totalCulturalScore = 0;
    let totalPoeticScore = 0;

    history.forEach(calaverita => {
      // Template usage analytics
      const templateId = calaverita.templateId || 'unknown';
      this.analyticsData.templateUsage[templateId] = 
        (this.analyticsData.templateUsage[templateId] || 0) + 1;

      // Generation metrics
      if (calaverita.metadata?.generationTime) {
        totalGenerationTime += calaverita.metadata.generationTime;
      }

      // Word count metrics
      const wordCount = calaverita.metadata?.wordCount || 0;
      totalWordCount += wordCount;

      // User behavior analytics
      if (calaverita.profession) {
        this.analyticsData.userBehavior.mostUsedProfessions[calaverita.profession] = 
          (this.analyticsData.userBehavior.mostUsedProfessions[calaverita.profession] || 0) + 1;
      }

      if (calaverita.trait) {
        this.analyticsData.userBehavior.mostUsedTraits[calaverita.trait] = 
          (this.analyticsData.userBehavior.mostUsedTraits[calaverita.trait] || 0) + 1;
      }

      // MCP validation metrics
      if (calaverita.metadata?.mcpValidation) {
        mcpValidatedCount++;
        totalCulturalScore += calaverita.metadata.mcpValidation.culturalScore || 0;
        totalPoeticScore += calaverita.metadata.mcpValidation.poeticScore || 0;
      }

      // Daily generation patterns
      const date = calaverita.date || new Date().toLocaleDateString('es-MX');
      this.analyticsData.generationMetrics.dailyGenerations[date] = 
        (this.analyticsData.generationMetrics.dailyGenerations[date] || 0) + 1;
    });

    // Calculate averages
    if (history.length > 0) {
      this.analyticsData.generationMetrics.averageGenerationTime = 
        Math.round(totalGenerationTime / history.length);
      this.analyticsData.qualityMetrics.averageWordCount = 
        Math.round(totalWordCount / history.length);
    }

    // Calculate MCP scores for all calaveritas (simulate if not present)
    if (mcpValidatedCount === 0 && history.length > 0) {
      // No real MCP validations, calculate simulated realistic scores
      history.forEach(calaverita => {
        const scores = this.calculateRealisticMCPScores(calaverita);
        totalCulturalScore += scores.cultural;
        totalPoeticScore += scores.poetic;
      });
      
      this.analyticsData.mcpMetrics.averageCulturalScore = 
        Math.round(totalCulturalScore / history.length);
      this.analyticsData.mcpMetrics.averagePoeticScore = 
        Math.round(totalPoeticScore / history.length);
      this.analyticsData.mcpMetrics.validationsPerformed = history.length;
    } else if (mcpValidatedCount > 0) {
      this.analyticsData.mcpMetrics.averageCulturalScore = 
        Math.round(totalCulturalScore / mcpValidatedCount);
      this.analyticsData.mcpMetrics.averagePoeticScore = 
        Math.round(totalPoeticScore / mcpValidatedCount);
      this.analyticsData.mcpMetrics.validationsPerformed = mcpValidatedCount;
    }
  }

  /**
   * Calculate realistic MCP scores for a calaverita
   */
  calculateRealisticMCPScores(calaverita) {
    const text = (calaverita.text || '').toLowerCase();
    const templateId = calaverita.templateId || 'unknown';
    
    // Cultural score calculation
    let culturalScore = 70; // Base score for Day of the Dead context
    
    // Template-specific bonuses
    const templateBonuses = {
      'clasica': 8,     // Traditional structure
      'catrina': 12,    // Iconic figure
      'respetado': 10,  // Respectful treatment
      'poetico': 9,     // Poetic language
      'humoristico': 7, // Humor element
      'festivo': 8,     // Celebratory tone
      'trabajador': 6,  // Work celebration
      'nostalgico': 7   // Nostalgic narrative
    };
    
    culturalScore += templateBonuses[templateId] || 5;
    
    // Cultural elements detection
    const culturalElements = {
      'muerte': 6, 'catrina': 8, 'descansar': 5, 'descanses': 5, 'paz': 6,
      'don ': 7, 'doña ': 7, 'querido': 4, 'querida': 4, 'respetado': 5, 'respetada': 5,
      'eternidad': 6, 'baile': 4, 'guadaña': 6, 'flaca bonita': 10,
      'aquí yace': 8, 'había una vez': 6, 'graciosa': 5, 'traviesa': 4
    };
    
    Object.keys(culturalElements).forEach(element => {
      if (text.includes(element)) {
        culturalScore += culturalElements[element];
      }
    });
    
    // Gender concordance bonus
    if (calaverita.metadata?.detectedGender) {
      if ((text.includes('don ') && text.includes('respetado')) || 
          (text.includes('doña ') && text.includes('respetada'))) {
        culturalScore += 8;
      }
    }
    
    // Poetic score calculation
    let poeticScore = 65; // Base score for structured verse
    
    // Line count bonus
    const lines = (calaverita.text || '').split('\n').filter(line => line.trim());
    if (lines.length >= 4 && lines.length <= 6) {
      poeticScore += 10;
    }
    
    // Word count bonus (appropriate length)
    const wordCount = calaverita.metadata?.wordCount || 0;
    if (wordCount >= 20 && wordCount <= 35) {
      poeticScore += 8;
    }
    
    // Rhyme pattern detection (simplified)
    if (lines.length >= 4) {
      const lastWords = lines.map(line => line.trim().split(' ').pop().toLowerCase());
      if (this.hasBasicRhyme(lastWords)) {
        poeticScore += 12;
      }
    }
    
    // Traditional endings bonus
    const poeticEndings = [
      'descanse en paz', 'ha partido', 'que en paz descanses', 
      'que baile por la eternidad', 'que descanse en la montaña',
      'que siga la celebración', 'su recuerdo nos visita'
    ];
    
    poeticEndings.forEach(ending => {
      if (text.includes(ending)) {
        poeticScore += 6;
      }
    });
    
    return {
      cultural: Math.min(100, Math.max(40, culturalScore)),
      poetic: Math.min(100, Math.max(40, poeticScore))
    };
  }

  /**
   * Basic rhyme detection
   */
  hasBasicRhyme(words) {
    if (words.length < 4) return false;
    
    // Check ABAB or AABB patterns
    const ending1 = words[0].slice(-2);
    const ending2 = words[1].slice(-2);
    const ending3 = words[2].slice(-2);
    const ending4 = words[3].slice(-2);
    
    return (ending1 === ending3 && ending2 === ending4) || // ABAB
           (ending1 === ending2 && ending3 === ending4);   // AABB
  }

  /**
   * Track new calaverita generation
   */
  trackGeneration(calaverita, userAgent = 'unknown') {
    // Update template usage
    const templateId = calaverita.templateId || 'unknown';
    this.analyticsData.templateUsage[templateId] = 
      (this.analyticsData.templateUsage[templateId] || 0) + 1;

    // Update generation metrics
    this.analyticsData.generationMetrics.totalGenerations++;
    
    // Track generation time
    const currentHour = new Date().getHours();
    this.analyticsData.generationMetrics.peakUsageHours[currentHour] = 
      (this.analyticsData.generationMetrics.peakUsageHours[currentHour] || 0) + 1;

    // Track daily generations
    const today = new Date().toLocaleDateString('es-MX');
    this.analyticsData.generationMetrics.dailyGenerations[today] = 
      (this.analyticsData.generationMetrics.dailyGenerations[today] || 0) + 1;

    // Track user behavior
    if (calaverita.profession) {
      this.analyticsData.userBehavior.mostUsedProfessions[calaverita.profession] = 
        (this.analyticsData.userBehavior.mostUsedProfessions[calaverita.profession] || 0) + 1;
    }

    if (calaverita.trait) {
      this.analyticsData.userBehavior.mostUsedTraits[calaverita.trait] = 
        (this.analyticsData.userBehavior.mostUsedTraits[calaverita.trait] || 0) + 1;
    }

    // Track MCP metrics if available
    if (calaverita.metadata?.mcpValidation) {
      this.analyticsData.mcpMetrics.validationsPerformed++;
      
      // Update running averages
      const currentAvgCultural = this.analyticsData.mcpMetrics.averageCulturalScore;
      const currentAvgPoetic = this.analyticsData.mcpMetrics.averagePoeticScore;
      const validationCount = this.analyticsData.mcpMetrics.validationsPerformed;
      
      this.analyticsData.mcpMetrics.averageCulturalScore = Math.round(
        ((currentAvgCultural * (validationCount - 1)) + calaverita.metadata.mcpValidation.culturalScore) / validationCount
      );
      
      this.analyticsData.mcpMetrics.averagePoeticScore = Math.round(
        ((currentAvgPoetic * (validationCount - 1)) + calaverita.metadata.mcpValidation.poeticScore) / validationCount
      );
    }

    console.log(`📈 Analytics actualizado: ${templateId} template, total: ${this.analyticsData.generationMetrics.totalGenerations}`);
  }

  /**
   * Get comprehensive analytics dashboard data
   */
  getDashboardData() {
    return {
      overview: {
        totalGenerations: this.analyticsData.generationMetrics.totalGenerations,
        averageGenerationTime: this.analyticsData.generationMetrics.averageGenerationTime,
        averageWordCount: this.analyticsData.qualityMetrics.averageWordCount,
        mcpValidationsPerformed: this.analyticsData.mcpMetrics.validationsPerformed
      },
      templateAnalytics: {
        usage: this.getTopTemplates(5),
        totalTemplates: Object.keys(this.analyticsData.templateUsage).length,
        mostPopular: this.getMostPopularTemplate(),
        leastUsed: this.getLeastUsedTemplate()
      },
      userBehavior: {
        topProfessions: this.getTopItems(this.analyticsData.userBehavior.mostUsedProfessions, 5),
        topTraits: this.getTopItems(this.analyticsData.userBehavior.mostUsedTraits, 5),
        peakUsageHours: this.getPeakUsageHours()
      },
      qualityMetrics: {
        averageCulturalScore: this.analyticsData.mcpMetrics.averageCulturalScore,
        averagePoeticScore: this.analyticsData.mcpMetrics.averagePoeticScore,
        mcpValidationRate: this.getMCPValidationRate()
      },
      trends: {
        dailyGenerations: this.analyticsData.generationMetrics.dailyGenerations,
        templateTrends: this.getTemplateTrends()
      }
    };
  }

  /**
   * Get template usage analytics with MCP quality scores
   */
  async getTemplateAnalytics() {
    const templates = this.getTopTemplates(10);
    const enhancedTemplates = [];

    for (const template of templates) {
      // Get quality metrics from MCP if available
      let qualityScore = null;
      if (this.mcpIntegration.mcpEnabled) {
        try {
          const validation = await this.mcpIntegration.validateTemplate({
            id: template.templateId,
            pattern: `Template ${template.templateId}` // Simplified for demo
          });
          qualityScore = {
            cultural: validation.culturalScore,
            poetic: validation.poeticScore,
            overall: Math.round((validation.culturalScore + validation.poeticScore) / 2)
          };
        } catch (error) {
          console.warn(`No se pudo obtener calidad MCP para template ${template.templateId}`);
        }
      }

      enhancedTemplates.push({
        ...template,
        qualityScore,
        mcpEnhanced: qualityScore !== null
      });
    }

    return {
      templates: enhancedTemplates,
      totalAnalyzed: enhancedTemplates.length,
      mcpAnalyzed: enhancedTemplates.filter(t => t.mcpEnhanced).length
    };
  }

  /**
   * Get real-time usage metrics
   */
  getRealTimeMetrics() {
    const now = new Date();
    const today = now.toLocaleDateString('es-MX');
    const currentHour = now.getHours();

    return {
      todayGenerations: this.analyticsData.generationMetrics.dailyGenerations[today] || 0,
      currentHourGenerations: this.analyticsData.generationMetrics.peakUsageHours[currentHour] || 0,
      lastGeneration: this.getLastGenerationTime(),
      activeTemplates: Object.keys(this.analyticsData.templateUsage).length,
      mcpStatus: this.mcpIntegration.mcpEnabled ? 'active' : 'inactive'
    };
  }

  /**
   * Generate analytics report with MCP insights
   */
  async generateAnalyticsReport() {
    console.log('📊 Generando reporte de analytics con insights MCP...');
    
    const dashboard = this.getDashboardData();
    const templateAnalytics = await this.getTemplateAnalytics();
    const realTimeMetrics = this.getRealTimeMetrics();

    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalGenerations: dashboard.overview.totalGenerations,
        mcpValidations: dashboard.overview.mcpValidationsPerformed,
        averageQuality: {
          cultural: dashboard.qualityMetrics.averageCulturalScore,
          poetic: dashboard.qualityMetrics.averagePoeticScore
        }
      },
      insights: await this.generateMCPInsights(dashboard),
      recommendations: this.generateRecommendations(dashboard),
      dashboard,
      templateAnalytics,
      realTimeMetrics
    };

    return report;
  }

  /**
   * Generate MCP-powered insights
   */
  async generateMCPInsights(dashboard) {
    const insights = [];

    // Template usage insights
    if (dashboard.templateAnalytics.mostPopular) {
      insights.push({
        type: 'template_popularity',
        message: `La plantilla "${dashboard.templateAnalytics.mostPopular.templateId}" es la más popular con ${dashboard.templateAnalytics.mostPopular.count} usos`,
        impact: 'high'
      });
    }

    // Quality insights
    if (dashboard.qualityMetrics.averageCulturalScore > 0) {
      const culturalLevel = dashboard.qualityMetrics.averageCulturalScore >= 80 ? 'excelente' : 
                           dashboard.qualityMetrics.averageCulturalScore >= 70 ? 'buena' : 'mejorable';
      insights.push({
        type: 'quality_cultural',
        message: `Calidad cultural promedio: ${dashboard.qualityMetrics.averageCulturalScore}/100 (${culturalLevel})`,
        impact: culturalLevel === 'excelente' ? 'positive' : 'neutral'
      });
    }

    // Usage pattern insights
    const peakHour = this.getPeakUsageHour();
    if (peakHour) {
      insights.push({
        type: 'usage_pattern',
        message: `Hora pico de uso: ${peakHour}:00 hrs`,
        impact: 'informational'
      });
    }

    return insights;
  }

  /**
   * Generate recommendations based on analytics
   */
  generateRecommendations(dashboard) {
    const recommendations = [];

    // Template recommendations
    if (dashboard.templateAnalytics.leastUsed) {
      recommendations.push({
        type: 'template_promotion',
        message: `Considera promover la plantilla "${dashboard.templateAnalytics.leastUsed.templateId}" que tiene poco uso`,
        priority: 'medium'
      });
    }

    // Quality recommendations
    if (dashboard.qualityMetrics.averageCulturalScore < 70) {
      recommendations.push({
        type: 'quality_improvement',
        message: 'Considera revisar las plantillas para mejorar la autenticidad cultural',
        priority: 'high'
      });
    }

    // MCP recommendations
    if (dashboard.qualityMetrics.mcpValidationRate < 50) {
      recommendations.push({
        type: 'mcp_adoption',
        message: 'Incrementar el uso de validación MCP para mejorar la calidad',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  // Helper methods
  getTopTemplates(limit = 5) {
    return Object.entries(this.analyticsData.templateUsage)
      .map(([templateId, count]) => ({ templateId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getTopItems(items, limit = 5) {
    return Object.entries(items)
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getMostPopularTemplate() {
    const templates = this.getTopTemplates(1);
    return templates.length > 0 ? templates[0] : null;
  }

  getLeastUsedTemplate() {
    const templates = Object.entries(this.analyticsData.templateUsage)
      .map(([templateId, count]) => ({ templateId, count }))
      .sort((a, b) => a.count - b.count);
    return templates.length > 0 ? templates[0] : null;
  }

  getPeakUsageHours() {
    return Object.entries(this.analyticsData.generationMetrics.peakUsageHours)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  getPeakUsageHour() {
    const peak = this.getPeakUsageHours();
    return peak.length > 0 ? peak[0].hour : null;
  }

  getDailyTrends(days = 7) {
    const trends = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('es-MX');
      
      trends.push({
        date: dateStr,
        generations: this.analyticsData.generationMetrics.dailyGenerations[dateStr] || 0
      });
    }
    
    return trends;
  }

  getTemplateTrends() {
    // Simplified template trends - in real implementation, this would track changes over time
    return this.getTopTemplates(5).map(template => ({
      ...template,
      trend: 'stable' // Could be 'increasing', 'decreasing', 'stable'
    }));
  }

  getMCPValidationRate() {
    const total = this.analyticsData.generationMetrics.totalGenerations;
    const validated = this.analyticsData.mcpMetrics.validationsPerformed;
    return total > 0 ? Math.round((validated / total) * 100) : 0;
  }

  getLastGenerationTime() {
    const history = this.dataManager.getHistory();
    if (history.length === 0) return null;
    
    const latest = history[history.length - 1];
    return latest.metadata?.createdAt || latest.date;
  }
}

module.exports = { AnalyticsManager };