/**
 * Analytics Dashboard - Frontend Component
 * Displays comprehensive analytics and monitoring data
 */

class AnalyticsDashboard {
  constructor() {
    this.isVisible = false;
    this.refreshInterval = null;
    this.templateChart = null;
    this.trendsChart = null;
    this.initializeDashboard();
  }

  /**
   * Initialize the analytics dashboard
   */
  initializeDashboard() {
    this.createDashboardHTML();
    this.attachEventListeners();
    console.log('📊 Analytics Dashboard inicializado');
  }

  /**
   * Create the dashboard HTML structure
   */
  createDashboardHTML() {
    const dashboardHTML = `
      <div id="analytics-dashboard" class="analytics-dashboard hidden">
        <div class="dashboard-header">
          <h2>📊 Dashboard de Analytics</h2>
          <div class="dashboard-controls">
            <button id="refresh-analytics" class="btn btn-secondary">🔄 Actualizar</button>
            <button id="export-analytics" class="btn btn-secondary">📥 Exportar</button>
            <button id="close-dashboard" class="btn btn-danger">✖️ Cerrar</button>
          </div>
        </div>
        
        <div class="dashboard-content">
          <!-- Real-time metrics -->
          <div class="metrics-section">
            <h3>⚡ Métricas en Tiempo Real</h3>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-value" id="total-generations">-</div>
                <div class="metric-label">Total Generaciones</div>
              </div>
              <div class="metric-card">
                <div class="metric-value" id="today-generations">-</div>
                <div class="metric-label">Hoy</div>
              </div>
              <div class="metric-card">
                <div class="metric-value" id="avg-quality">-</div>
                <div class="metric-label">Calidad Promedio</div>
              </div>
              <div class="metric-card">
                <div class="metric-value" id="mcp-status">-</div>
                <div class="metric-label">Estado MCP</div>
              </div>
            </div>
          </div>

          <!-- Template analytics -->
          <div class="analytics-section">
            <h3>🎭 Analytics de Plantillas</h3>
            <div class="template-analytics">
              <div class="chart-container">
                <canvas id="template-usage-chart"></canvas>
              </div>
              <div class="template-list" id="template-list">
                <!-- Template list will be populated here -->
              </div>
            </div>
          </div>

          <!-- User behavior -->
          <div class="analytics-section">
            <h3>👥 Comportamiento de Usuarios</h3>
            <div class="behavior-analytics">
              <div class="top-items">
                <h4>🏆 Profesiones Más Usadas</h4>
                <div id="top-professions" class="top-list">
                  <!-- Will be populated -->
                </div>
              </div>
              <div class="top-items">
                <h4>✨ Características Más Usadas</h4>
                <div id="top-traits" class="top-list">
                  <!-- Will be populated -->
                </div>
              </div>
            </div>
          </div>

          <!-- Quality metrics -->
          <div class="analytics-section">
            <h3>🎯 Métricas de Calidad MCP</h3>
            <div class="quality-metrics">
              <div class="quality-scores">
                <div class="score-item">
                  <div class="score-circle" id="cultural-score">
                    <span class="score-value">-</span>
                    <span class="score-label">Cultural</span>
                  </div>
                </div>
                <div class="score-item">
                  <div class="score-circle" id="poetic-score">
                    <span class="score-value">-</span>
                    <span class="score-label">Poético</span>
                  </div>
                </div>
                <div class="score-item">
                  <div class="score-circle" id="validation-rate">
                    <span class="score-value">-</span>
                    <span class="score-label">Validación</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Insights and recommendations -->
          <div class="analytics-section">
            <h3>💡 Insights y Recomendaciones</h3>
            <div class="insights-container">
              <div class="insights-list" id="insights-list">
                <!-- Insights will be populated -->
              </div>
              <div class="recommendations-list" id="recommendations-list">
                <!-- Recommendations will be populated -->
              </div>
            </div>
          </div>

          <!-- Trends -->
          <div class="analytics-section">
            <h3>📈 Tendencias (Últimos 7 días)</h3>
            <div class="trends-container">
              <canvas id="trends-chart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add to body if not exists
    if (!document.getElementById('analytics-dashboard')) {
      document.body.insertAdjacentHTML('beforeend', dashboardHTML);
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Dashboard controls
    document.getElementById('refresh-analytics')?.addEventListener('click', () => {
      this.refreshDashboard();
    });

    document.getElementById('export-analytics')?.addEventListener('click', () => {
      this.exportAnalytics();
    });

    document.getElementById('close-dashboard')?.addEventListener('click', () => {
      this.hideDashboard();
    });
  }

  /**
   * Show the analytics dashboard
   */
  async showDashboard() {
    const dashboard = document.getElementById('analytics-dashboard');
    if (dashboard) {
      dashboard.classList.remove('hidden');
      this.isVisible = true;
      
      // Load initial data
      await this.refreshDashboard();
      
      // Start auto-refresh every 30 seconds
      this.startAutoRefresh();
      
      console.log('📊 Dashboard de analytics mostrado');
    }
  }

  /**
   * Hide the analytics dashboard
   */
  hideDashboard() {
    const dashboard = document.getElementById('analytics-dashboard');
    if (dashboard) {
      dashboard.classList.add('hidden');
      this.isVisible = false;
      
      // Stop auto-refresh
      this.stopAutoRefresh();
      
      console.log('📊 Dashboard de analytics ocultado');
    }
  }

  /**
   * Toggle dashboard visibility
   */
  toggleDashboard() {
    if (this.isVisible) {
      this.hideDashboard();
    } else {
      this.showDashboard();
    }
  }

  /**
   * Refresh dashboard data
   */
  async refreshDashboard() {
    try {
      console.log('🔄 Actualizando dashboard de analytics...');
      
      // Load all analytics data
      const [dashboard, realTime, templateAnalytics, report] = await Promise.all([
        this.fetchDashboardData(),
        this.fetchRealTimeMetrics(),
        this.fetchTemplateAnalytics(),
        this.fetchAnalyticsReport()
      ]);

      // Update UI components
      this.updateRealTimeMetrics(realTime);
      this.updateTemplateAnalytics(templateAnalytics);
      this.updateUserBehavior(dashboard.userBehavior);
      this.updateQualityMetrics(dashboard.qualityMetrics);
      this.updateInsightsAndRecommendations(report.insights, report.recommendations);
      this.updateTrends(dashboard.trends);

      console.log('✅ Dashboard actualizado exitosamente');
    } catch (error) {
      console.error('❌ Error actualizando dashboard:', error);
      this.showError('Error actualizando el dashboard de analytics');
    }
  }

  /**
   * Fetch dashboard data from API
   */
  async fetchDashboardData() {
    const response = await fetch('/api/analytics/dashboard');
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }

  /**
   * Fetch real-time metrics
   */
  async fetchRealTimeMetrics() {
    const response = await fetch('/api/analytics/realtime');
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }

  /**
   * Fetch template analytics
   */
  async fetchTemplateAnalytics() {
    const response = await fetch('/api/analytics/templates');
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }

  /**
   * Fetch analytics report
   */
  async fetchAnalyticsReport() {
    const response = await fetch('/api/analytics/report');
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }

  /**
   * Update real-time metrics display
   */
  updateRealTimeMetrics(metrics) {
    document.getElementById('total-generations').textContent = metrics.todayGenerations || 0;
    document.getElementById('today-generations').textContent = metrics.todayGenerations || 0;
    document.getElementById('mcp-status').textContent = metrics.mcpStatus === 'active' ? '🟢 Activo' : '🟡 Básico';
  }

  /**
   * Update template analytics display
   */
  updateTemplateAnalytics(analytics) {
    // Update template usage chart
    this.updateTemplateUsageChart(analytics);
    
    // Update template list
    const templateList = document.getElementById('template-list');
    if (!templateList) return;

    templateList.innerHTML = '';
    
    analytics.templates.forEach(template => {
      const templateItem = document.createElement('div');
      templateItem.className = 'template-item';
      
      const qualityBadge = template.mcpEnhanced ? 
        `<span class="quality-badge">MCP: ${template.qualityScore.overall}/100</span>` : 
        '<span class="quality-badge basic">Básico</span>';
      
      templateItem.innerHTML = `
        <div class="template-info">
          <span class="template-name">${template.templateId}</span>
          <span class="template-count">${template.count} usos</span>
        </div>
        ${qualityBadge}
      `;
      
      templateList.appendChild(templateItem);
    });
  }

  /**
   * Update template usage chart
   */
  updateTemplateUsageChart(analytics) {
    const ctx = document.getElementById('template-usage-chart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.templateChart) {
      this.templateChart.destroy();
    }

    // Prepare data for chart
    const labels = analytics.templates.map(t => t.templateId);
    const data = analytics.templates.map(t => t.count);
    const colors = [
      '#6b46c1', '#059669', '#ff6b35', '#3b82f6', 
      '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'
    ];

    this.templateChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          title: {
            display: true,
            text: 'Uso de Plantillas',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: 20
          }
        }
      }
    });
  }

  /**
   * Update user behavior display
   */
  updateUserBehavior(behavior) {
    // Update top professions
    const professionsContainer = document.getElementById('top-professions');
    if (professionsContainer && behavior.topProfessions) {
      professionsContainer.innerHTML = '';
      behavior.topProfessions.forEach((prof, index) => {
        const item = document.createElement('div');
        item.className = 'top-item';
        item.innerHTML = `
          <span class="rank">${index + 1}.</span>
          <span class="item-name">${prof.item}</span>
          <span class="item-count">${prof.count}</span>
        `;
        professionsContainer.appendChild(item);
      });
    }

    // Update top traits
    const traitsContainer = document.getElementById('top-traits');
    if (traitsContainer && behavior.topTraits) {
      traitsContainer.innerHTML = '';
      behavior.topTraits.forEach((trait, index) => {
        const item = document.createElement('div');
        item.className = 'top-item';
        item.innerHTML = `
          <span class="rank">${index + 1}.</span>
          <span class="item-name">${trait.item}</span>
          <span class="item-count">${trait.count}</span>
        `;
        traitsContainer.appendChild(item);
      });
    }
  }

  /**
   * Update quality metrics display
   */
  updateQualityMetrics(quality) {
    // Update cultural score
    const culturalScore = document.getElementById('cultural-score');
    if (culturalScore) {
      const scoreValue = culturalScore.querySelector('.score-value');
      if (scoreValue) {
        scoreValue.textContent = quality.averageCulturalScore || 0;
        this.updateScoreColor(culturalScore, quality.averageCulturalScore || 0);
      }
    }

    // Update poetic score
    const poeticScore = document.getElementById('poetic-score');
    if (poeticScore) {
      const scoreValue = poeticScore.querySelector('.score-value');
      if (scoreValue) {
        scoreValue.textContent = quality.averagePoeticScore || 0;
        this.updateScoreColor(poeticScore, quality.averagePoeticScore || 0);
      }
    }

    // Update validation rate
    const validationRate = document.getElementById('validation-rate');
    if (validationRate) {
      const scoreValue = validationRate.querySelector('.score-value');
      if (scoreValue) {
        scoreValue.textContent = `${quality.mcpValidationRate || 0}%`;
        this.updateScoreColor(validationRate, quality.mcpValidationRate || 0);
      }
    }

    // Update average quality in real-time metrics
    const avgQuality = document.getElementById('avg-quality');
    if (avgQuality) {
      const overall = Math.round(((quality.averageCulturalScore || 0) + (quality.averagePoeticScore || 0)) / 2);
      avgQuality.textContent = `${overall}/100`;
    }
  }

  /**
   * Update score circle color based on value
   */
  updateScoreColor(element, score) {
    element.classList.remove('score-excellent', 'score-good', 'score-fair', 'score-poor');
    
    if (score >= 85) {
      element.classList.add('score-excellent');
    } else if (score >= 70) {
      element.classList.add('score-good');
    } else if (score >= 50) {
      element.classList.add('score-fair');
    } else {
      element.classList.add('score-poor');
    }
  }

  /**
   * Update insights and recommendations
   */
  updateInsightsAndRecommendations(insights, recommendations) {
    // Update insights
    const insightsList = document.getElementById('insights-list');
    if (insightsList && insights) {
      insightsList.innerHTML = '<h4>💡 Insights</h4>';
      insights.forEach(insight => {
        const item = document.createElement('div');
        item.className = `insight-item ${insight.impact}`;
        item.innerHTML = `
          <span class="insight-icon">${this.getInsightIcon(insight.type)}</span>
          <span class="insight-message">${insight.message}</span>
        `;
        insightsList.appendChild(item);
      });
    }

    // Update recommendations
    const recommendationsList = document.getElementById('recommendations-list');
    if (recommendationsList && recommendations) {
      recommendationsList.innerHTML = '<h4>🎯 Recomendaciones</h4>';
      recommendations.forEach(rec => {
        const item = document.createElement('div');
        item.className = `recommendation-item ${rec.priority}`;
        item.innerHTML = `
          <span class="rec-priority">${this.getPriorityIcon(rec.priority)}</span>
          <span class="rec-message">${rec.message}</span>
        `;
        recommendationsList.appendChild(item);
      });
    }
  }

  /**
   * Update trends chart
   */
  updateTrends(trends) {
    const ctx = document.getElementById('trends-chart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.trendsChart) {
      this.trendsChart.destroy();
    }

    // Prepare data for last 7 days
    const last7Days = this.getLast7Days();
    const dailyData = last7Days.map(date => {
      return trends.dailyGenerations && trends.dailyGenerations[date] ? trends.dailyGenerations[date] : 0;
    });

    this.trendsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7Days.map(date => this.formatDateForChart(date)),
        datasets: [{
          label: 'Calaveritas Generadas',
          data: dailyData,
          borderColor: '#ff6b35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ff6b35',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          title: {
            display: true,
            text: 'Tendencias de Generación (Últimos 7 días)',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: 20
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: {
                size: 11
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            ticks: {
              font: {
                size: 11
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  /**
   * Get last 7 days in format
   */
  getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('es-MX'));
    }
    return days;
  }

  /**
   * Format date for chart display
   */
  formatDateForChart(dateString) {
    const date = new Date(dateString.split('/').reverse().join('-'));
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-MX', { 
        weekday: 'short', 
        day: 'numeric',
        month: 'short'
      });
    }
  }

  /**
   * Export analytics data
   */
  async exportAnalytics() {
    try {
      console.log('📥 Exportando analytics...');
      
      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          format: 'json',
          includeInsights: true
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Create download link
        const blob = new Blob([JSON.stringify(result.data, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccess('Analytics exportado exitosamente');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error exportando analytics:', error);
      this.showError('Error exportando analytics');
    }
  }

  /**
   * Start auto-refresh
   */
  startAutoRefresh() {
    this.stopAutoRefresh(); // Clear any existing interval
    this.refreshInterval = setInterval(() => {
      if (this.isVisible) {
        this.refreshDashboard();
      }
    }, 30000); // Refresh every 30 seconds
  }

  /**
   * Stop auto-refresh
   */
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  // Helper methods
  getInsightIcon(type) {
    const icons = {
      'template_popularity': '🏆',
      'quality_cultural': '🎭',
      'usage_pattern': '⏰',
      'default': '💡'
    };
    return icons[type] || icons.default;
  }

  getPriorityIcon(priority) {
    const icons = {
      'high': '🔴',
      'medium': '🟡',
      'low': '🟢'
    };
    return icons[priority] || icons.medium;
  }

  showSuccess(message) {
    // Simple success notification
    console.log('✅', message);
    alert(`✅ ${message}`);
  }

  showError(message) {
    // Simple error notification
    console.error('❌', message);
    alert(`❌ ${message}`);
  }
}

// Export for use in main application
window.AnalyticsDashboard = AnalyticsDashboard;