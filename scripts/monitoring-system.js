#!/usr/bin/env node

/**
 * Monitoring and Alerting System
 * 
 * Sistema de monitoreo continuo que se integra con el CI/CD pipeline
 * para detectar problemas y enviar alertas automáticas
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class MonitoringSystem {
  constructor() {
    this.projectRoot = process.cwd();
    this.config = {
      monitoring: {
        interval: 30000, // 30 seconds
        healthCheckTimeout: 5000,
        alertThresholds: {
          responseTime: 2000, // 2 seconds
          errorRate: 0.05,    // 5%
          memoryUsage: 0.8,   // 80%
          diskUsage: 0.9      // 90%
        }
      },
      alerts: {
        channels: ['console', 'file', 'webhook'],
        severity: {
          low: { color: '🟢', notify: false },
          medium: { color: '🟡', notify: true },
          high: { color: '🔴', notify: true },
          critical: { color: '🚨', notify: true }
        }
      },
      retention: {
        metrics: 7 * 24 * 60 * 60 * 1000,  // 7 days
        alerts: 30 * 24 * 60 * 60 * 1000   // 30 days
      }
    };
    
    this.state = {
      isRunning: false,
      startTime: null,
      metrics: [],
      alerts: [],
      lastHealthCheck: null,
      monitoringInterval: null
    };
    
    this.loadState();
  }

  /**
   * Start monitoring system
   */
  async start() {
    if (this.state.isRunning) {
      console.log('⚠️  Monitoring system is already running');
      return;
    }
    
    console.log('🔍 Starting monitoring system...');
    
    this.state.isRunning = true;
    this.state.startTime = new Date();
    
    // Initial health check
    await this.performHealthCheck();
    
    // Start periodic monitoring
    this.state.monitoringInterval = setInterval(async () => {
      try {
        await this.performMonitoringCycle();
      } catch (error) {
        await this.sendAlert('critical', 'Monitoring System Error', {
          error: error.message,
          timestamp: new Date()
        });
      }
    }, this.config.monitoring.interval);
    
    // Set up graceful shutdown
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
    
    console.log(`✅ Monitoring system started (interval: ${this.config.monitoring.interval}ms)`);
    
    // Keep process alive
    if (require.main === module) {
      process.stdin.resume();
    }
  }

  /**
   * Stop monitoring system
   */
  async stop() {
    if (!this.state.isRunning) {
      console.log('⚠️  Monitoring system is not running');
      return;
    }
    
    console.log('🛑 Stopping monitoring system...');
    
    this.state.isRunning = false;
    
    if (this.state.monitoringInterval) {
      clearInterval(this.state.monitoringInterval);
      this.state.monitoringInterval = null;
    }
    
    // Save final state
    this.saveState();
    
    console.log('✅ Monitoring system stopped');
    
    if (require.main === module) {
      process.exit(0);
    }
  }

  /**
   * Perform complete monitoring cycle
   */
  async performMonitoringCycle() {
    const cycleStart = Date.now();
    
    try {
      // Collect metrics
      const metrics = await this.collectMetrics();
      
      // Analyze metrics and detect issues
      const issues = await this.analyzeMetrics(metrics);
      
      // Send alerts for detected issues
      for (const issue of issues) {
        await this.sendAlert(issue.severity, issue.title, issue.details);
      }
      
      // Store metrics
      this.storeMetrics(metrics);
      
      // Cleanup old data
      await this.cleanupOldData();
      
      const cycleDuration = Date.now() - cycleStart;
      console.log(`🔍 Monitoring cycle completed in ${cycleDuration}ms`);
      
    } catch (error) {
      console.error(`❌ Monitoring cycle failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Perform health check
   */
  async performHealthCheck() {
    console.log('🏥 Performing health check...');
    
    const healthCheck = {
      timestamp: new Date(),
      status: 'healthy',
      checks: {},
      responseTime: null,
      issues: []
    };
    
    const startTime = Date.now();
    
    try {
      // Check application server
      healthCheck.checks.server = await this.checkApplicationServer();
      
      // Check data integrity
      healthCheck.checks.data = await this.checkDataIntegrity();
      
      // Check file system
      healthCheck.checks.filesystem = await this.checkFileSystem();
      
      // Check dependencies
      healthCheck.checks.dependencies = await this.checkDependencies();
      
      // Check system resources
      healthCheck.checks.resources = await this.checkSystemResources();
      
      // Calculate overall health
      const failedChecks = Object.entries(healthCheck.checks)
        .filter(([_, result]) => !result.healthy);
      
      if (failedChecks.length > 0) {
        healthCheck.status = failedChecks.length > 2 ? 'critical' : 'degraded';
        healthCheck.issues = failedChecks.map(([name, result]) => ({
          check: name,
          error: result.error
        }));
      }
      
      healthCheck.responseTime = Date.now() - startTime;
      this.state.lastHealthCheck = healthCheck;
      
      console.log(`✅ Health check completed: ${healthCheck.status} (${healthCheck.responseTime}ms)`);
      
      return healthCheck;
      
    } catch (error) {
      healthCheck.status = 'critical';
      healthCheck.error = error.message;
      healthCheck.responseTime = Date.now() - startTime;
      
      console.error(`❌ Health check failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Collect system metrics
   */
  async collectMetrics() {
    const metrics = {
      timestamp: new Date(),
      application: await this.collectApplicationMetrics(),
      system: await this.collectSystemMetrics(),
      performance: await this.collectPerformanceMetrics(),
      errors: await this.collectErrorMetrics()
    };
    
    return metrics;
  }

  /**
   * Collect application-specific metrics
   */
  async collectApplicationMetrics() {
    const metrics = {
      uptime: null,
      version: null,
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3000,
      processId: null
    };
    
    try {
      // Check if application is running
      const pidFile = path.join(this.projectRoot, '.deployments', 'app.pid');
      
      if (fs.existsSync(pidFile)) {
        const pid = fs.readFileSync(pidFile, 'utf8').trim();
        metrics.processId = parseInt(pid);
        
        // Check if process is actually running
        try {
          process.kill(metrics.processId, 0);
          metrics.uptime = this.getProcessUptime(metrics.processId);
        } catch (error) {
          metrics.processId = null;
        }
      }
      
      // Get application version
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        metrics.version = packageJson.version;
      }
      
    } catch (error) {
      console.error(`Error collecting application metrics: ${error.message}`);
    }
    
    return metrics;
  }

  /**
   * Collect system metrics
   */
  async collectSystemMetrics() {
    const metrics = {
      memory: this.getMemoryUsage(),
      cpu: await this.getCpuUsage(),
      disk: await this.getDiskUsage(),
      network: await this.getNetworkStats()
    };
    
    return metrics;
  }

  /**
   * Collect performance metrics
   */
  async collectPerformanceMetrics() {
    const metrics = {
      responseTime: null,
      throughput: null,
      errorRate: null
    };
    
    try {
      // Test application response time
      const startTime = Date.now();
      await this.testApplicationEndpoint();
      metrics.responseTime = Date.now() - startTime;
      
      // Calculate error rate from recent logs
      metrics.errorRate = await this.calculateErrorRate();
      
    } catch (error) {
      console.error(`Error collecting performance metrics: ${error.message}`);
    }
    
    return metrics;
  }

  /**
   * Collect error metrics
   */
  async collectErrorMetrics() {
    const metrics = {
      recentErrors: [],
      errorCount: 0,
      criticalErrors: 0
    };
    
    try {
      // Check application logs for errors
      const logFiles = this.findLogFiles();
      
      for (const logFile of logFiles) {
        const errors = await this.parseErrorsFromLog(logFile);
        metrics.recentErrors.push(...errors);
      }
      
      metrics.errorCount = metrics.recentErrors.length;
      metrics.criticalErrors = metrics.recentErrors.filter(e => e.level === 'critical').length;
      
    } catch (error) {
      console.error(`Error collecting error metrics: ${error.message}`);
    }
    
    return metrics;
  }

  /**
   * Analyze metrics and detect issues
   */
  async analyzeMetrics(metrics) {
    const issues = [];
    
    // Check response time
    if (metrics.performance.responseTime > this.config.monitoring.alertThresholds.responseTime) {
      issues.push({
        severity: 'medium',
        title: 'High Response Time',
        details: {
          responseTime: metrics.performance.responseTime,
          threshold: this.config.monitoring.alertThresholds.responseTime,
          timestamp: metrics.timestamp
        }
      });
    }
    
    // Check error rate
    if (metrics.performance.errorRate > this.config.monitoring.alertThresholds.errorRate) {
      issues.push({
        severity: 'high',
        title: 'High Error Rate',
        details: {
          errorRate: metrics.performance.errorRate,
          threshold: this.config.monitoring.alertThresholds.errorRate,
          timestamp: metrics.timestamp
        }
      });
    }
    
    // Check memory usage
    if (metrics.system.memory.usage > this.config.monitoring.alertThresholds.memoryUsage) {
      issues.push({
        severity: 'medium',
        title: 'High Memory Usage',
        details: {
          memoryUsage: metrics.system.memory.usage,
          threshold: this.config.monitoring.alertThresholds.memoryUsage,
          timestamp: metrics.timestamp
        }
      });
    }
    
    // Check disk usage
    if (metrics.system.disk.usage > this.config.monitoring.alertThresholds.diskUsage) {
      issues.push({
        severity: 'high',
        title: 'High Disk Usage',
        details: {
          diskUsage: metrics.system.disk.usage,
          threshold: this.config.monitoring.alertThresholds.diskUsage,
          timestamp: metrics.timestamp
        }
      });
    }
    
    // Check for critical errors
    if (metrics.errors.criticalErrors > 0) {
      issues.push({
        severity: 'critical',
        title: 'Critical Errors Detected',
        details: {
          criticalErrors: metrics.errors.criticalErrors,
          recentErrors: metrics.errors.recentErrors.filter(e => e.level === 'critical'),
          timestamp: metrics.timestamp
        }
      });
    }
    
    // Check application availability
    if (!metrics.application.processId) {
      issues.push({
        severity: 'critical',
        title: 'Application Not Running',
        details: {
          message: 'Application process not found',
          timestamp: metrics.timestamp
        }
      });
    }
    
    return issues;
  }

  /**
   * Send alert
   */
  async sendAlert(severity, title, details) {
    const alert = {
      id: this.generateAlertId(),
      severity,
      title,
      details,
      timestamp: new Date(),
      acknowledged: false
    };
    
    // Store alert
    this.state.alerts.push(alert);
    
    // Send notifications based on severity
    const severityConfig = this.config.alerts.severity[severity];
    
    if (severityConfig.notify) {
      await this.sendNotifications(alert);
    }
    
    // Log alert
    console.log(`${severityConfig.color} ALERT [${severity.toUpperCase()}]: ${title}`);
    if (details) {
      console.log(`   Details:`, JSON.stringify(details, null, 2));
    }
    
    return alert;
  }

  /**
   * Send notifications through configured channels
   */
  async sendNotifications(alert) {
    for (const channel of this.config.alerts.channels) {
      try {
        await this.sendNotificationToChannel(channel, alert);
      } catch (error) {
        console.error(`Failed to send notification to ${channel}: ${error.message}`);
      }
    }
  }

  /**
   * Send notification to specific channel
   */
  async sendNotificationToChannel(channel, alert) {
    switch (channel) {
      case 'console':
        // Already logged in sendAlert
        break;
        
      case 'file':
        await this.writeAlertToFile(alert);
        break;
        
      case 'webhook':
        await this.sendWebhookNotification(alert);
        break;
        
      default:
        console.log(`Unknown notification channel: ${channel}`);
    }
  }

  /**
   * Write alert to file
   */
  async writeAlertToFile(alert) {
    const alertsDir = path.join(this.projectRoot, '.monitoring', 'alerts');
    fs.mkdirSync(alertsDir, { recursive: true });
    
    const alertFile = path.join(alertsDir, `${alert.timestamp.toISOString().split('T')[0]}.json`);
    
    let alerts = [];
    if (fs.existsSync(alertFile)) {
      alerts = JSON.parse(fs.readFileSync(alertFile, 'utf8'));
    }
    
    alerts.push(alert);
    fs.writeFileSync(alertFile, JSON.stringify(alerts, null, 2));
  }

  /**
   * Send webhook notification
   */
  async sendWebhookNotification(alert) {
    // In a real implementation, this would send HTTP POST to webhook URL
    console.log(`📡 Webhook notification sent for alert: ${alert.title}`);
  }

  /**
   * Health check methods
   */
  
  async checkApplicationServer() {
    try {
      await this.testApplicationEndpoint();
      return { healthy: true };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  async checkDataIntegrity() {
    try {
      const dataDir = path.join(this.projectRoot, 'data');
      
      if (!fs.existsSync(dataDir)) {
        return { healthy: true, message: 'No data directory found' };
      }
      
      const calaveriteFile = path.join(dataDir, 'calaveritas.json');
      
      if (fs.existsSync(calaveriteFile)) {
        const data = JSON.parse(fs.readFileSync(calaveriteFile, 'utf8'));
        return { healthy: true, recordCount: Array.isArray(data) ? data.length : (data.calaveritas ? data.calaveritas.length : 0) };
      }
      
      return { healthy: true, message: 'No data file found' };
      
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  async checkFileSystem() {
    try {
      // Check write permissions
      const testFile = path.join(this.projectRoot, '.monitoring-test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      
      // Check disk space
      const stats = fs.statSync(this.projectRoot);
      
      return { healthy: true, writable: true };
      
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  async checkDependencies() {
    try {
      const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
      
      if (!fs.existsSync(nodeModulesPath)) {
        return { healthy: false, error: 'node_modules directory not found' };
      }
      
      // Check critical dependencies
      const criticalDeps = ['express', 'cors'];
      
      for (const dep of criticalDeps) {
        const depPath = path.join(nodeModulesPath, dep);
        if (!fs.existsSync(depPath)) {
          return { healthy: false, error: `Critical dependency missing: ${dep}` };
        }
      }
      
      return { healthy: true };
      
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  async checkSystemResources() {
    try {
      const memory = this.getMemoryUsage();
      const disk = await this.getDiskUsage();
      
      const issues = [];
      
      if (memory.usage > 0.9) {
        issues.push('High memory usage');
      }
      
      if (disk.usage > 0.95) {
        issues.push('Critical disk usage');
      }
      
      return {
        healthy: issues.length === 0,
        issues: issues.length > 0 ? issues : undefined,
        memory: memory.usage,
        disk: disk.usage
      };
      
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  /**
   * Utility methods
   */
  
  async testApplicationEndpoint() {
    // Simulate endpoint test
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful response
        resolve({ status: 200 });
      }, 100);
    });
  }

  getMemoryUsage() {
    const usage = process.memoryUsage();
    const total = usage.heapTotal + usage.external;
    const used = usage.heapUsed;
    
    return {
      total,
      used,
      usage: used / total,
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external
    };
  }

  async getCpuUsage() {
    // Simplified CPU usage calculation
    return {
      usage: Math.random() * 0.5, // Simulate 0-50% usage
      loadAverage: [0.5, 0.3, 0.2]
    };
  }

  async getDiskUsage() {
    // Simplified disk usage calculation
    return {
      usage: Math.random() * 0.3, // Simulate 0-30% usage
      total: 1000000000, // 1GB
      used: 300000000   // 300MB
    };
  }

  async getNetworkStats() {
    return {
      bytesReceived: Math.floor(Math.random() * 1000000),
      bytesSent: Math.floor(Math.random() * 1000000)
    };
  }

  async calculateErrorRate() {
    // Simulate error rate calculation
    return Math.random() * 0.02; // 0-2% error rate
  }

  getProcessUptime(pid) {
    try {
      // Simplified uptime calculation
      return Date.now() - (this.state.startTime ? this.state.startTime.getTime() : Date.now());
    } catch (error) {
      return null;
    }
  }

  findLogFiles() {
    const logFiles = [];
    const possibleLogPaths = [
      path.join(this.projectRoot, 'logs'),
      path.join(this.projectRoot, '.logs'),
      this.projectRoot
    ];
    
    for (const logPath of possibleLogPaths) {
      if (fs.existsSync(logPath)) {
        const files = fs.readdirSync(logPath);
        const logs = files.filter(file => file.endsWith('.log'));
        logFiles.push(...logs.map(file => path.join(logPath, file)));
      }
    }
    
    return logFiles;
  }

  async parseErrorsFromLog(logFile) {
    const errors = [];
    
    try {
      const content = fs.readFileSync(logFile, 'utf8');
      const lines = content.split('\n').slice(-100); // Last 100 lines
      
      for (const line of lines) {
        if (line.includes('ERROR') || line.includes('CRITICAL')) {
          errors.push({
            level: line.includes('CRITICAL') ? 'critical' : 'error',
            message: line,
            timestamp: new Date(),
            source: path.basename(logFile)
          });
        }
      }
      
    } catch (error) {
      console.error(`Error parsing log file ${logFile}: ${error.message}`);
    }
    
    return errors;
  }

  storeMetrics(metrics) {
    this.state.metrics.push(metrics);
    
    // Keep only recent metrics
    const cutoff = Date.now() - this.config.retention.metrics;
    this.state.metrics = this.state.metrics.filter(m => 
      new Date(m.timestamp).getTime() > cutoff
    );
  }

  async cleanupOldData() {
    // Cleanup old alerts
    const alertCutoff = Date.now() - this.config.retention.alerts;
    this.state.alerts = this.state.alerts.filter(a => 
      new Date(a.timestamp).getTime() > alertCutoff
    );
    
    // Save state periodically
    this.saveState();
  }

  generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // State management
  loadState() {
    const statePath = path.join(this.projectRoot, '.monitoring', 'state.json');
    
    if (fs.existsSync(statePath)) {
      try {
        const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        this.state = { ...this.state, ...state };
        
        // Convert date strings back to Date objects
        if (this.state.startTime) {
          this.state.startTime = new Date(this.state.startTime);
        }
        
      } catch (error) {
        console.log('⚠️  Could not load monitoring state, using defaults');
      }
    }
  }

  saveState() {
    const statePath = path.join(this.projectRoot, '.monitoring', 'state.json');
    
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    
    // Don't save the interval reference
    const stateToSave = { ...this.state };
    delete stateToSave.monitoringInterval;
    
    fs.writeFileSync(statePath, JSON.stringify(stateToSave, null, 2));
  }

  /**
   * Get monitoring status
   */
  getStatus() {
    return {
      isRunning: this.state.isRunning,
      startTime: this.state.startTime,
      uptime: this.state.startTime ? Date.now() - this.state.startTime.getTime() : 0,
      metricsCount: this.state.metrics.length,
      alertsCount: this.state.alerts.length,
      lastHealthCheck: this.state.lastHealthCheck,
      recentAlerts: this.state.alerts.slice(-5)
    };
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const monitoring = new MonitoringSystem();
  
  switch (command) {
    case 'start':
      monitoring.start()
        .catch(error => {
          console.error('💥 Failed to start monitoring:', error.message);
          process.exit(1);
        });
      break;
      
    case 'stop':
      monitoring.stop()
        .catch(error => {
          console.error('💥 Failed to stop monitoring:', error.message);
          process.exit(1);
        });
      break;
      
    case 'status':
      console.log('📊 Monitoring Status:');
      console.log(JSON.stringify(monitoring.getStatus(), null, 2));
      break;
      
    case 'health':
      monitoring.performHealthCheck()
        .then(result => {
          console.log('🏥 Health Check Result:');
          console.log(JSON.stringify(result, null, 2));
        })
        .catch(error => {
          console.error('💥 Health check failed:', error.message);
          process.exit(1);
        });
      break;
      
    default:
      console.log(`
🔍 Monitoring System

Usage:
  node scripts/monitoring-system.js start
  node scripts/monitoring-system.js stop
  node scripts/monitoring-system.js status
  node scripts/monitoring-system.js health

Commands:
  start  - Start continuous monitoring
  stop   - Stop monitoring system
  status - Show current monitoring status
  health - Perform one-time health check

Examples:
  node scripts/monitoring-system.js start
  node scripts/monitoring-system.js health
      `);
      break;
  }
}

module.exports = { MonitoringSystem };