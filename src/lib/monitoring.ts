/**
 * @file monitoring.ts
 * @copyright 2024 Abhinand. All rights reserved.
 * @license Proprietary
 */

import { WATERMARK } from './watermark';

interface UsageData {
  timestamp: number;
  domain: string;
  ip?: string;
  userAgent?: string;
  location?: string;
  action: 'view' | 'copy' | 'modify';
}

class MonitoringService {
  private static instance: MonitoringService;
  private usageLogs: UsageData[] = [];
  private readonly API_ENDPOINT = 'https://oyage-x1-monitoring.onrender.com/monitoring'; // Updated endpoint

  private constructor() {
    this.setupMonitoring();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private setupMonitoring(): void {
    // Monitor copy attempts
    document.addEventListener('copy', (e) => {
      this.logUsage('copy');
    });

    // Monitor view events
    window.addEventListener('load', () => {
      this.logUsage('view');
    });

    // Monitor code modifications
    this.setupCodeModificationDetection();
  }

  private setupCodeModificationDetection(): void {
    // Check for code modifications periodically
    setInterval(() => {
      if (this.detectCodeModification()) {
        this.logUsage('modify');
      }
    }, 5000);
  }

  private detectCodeModification(): boolean {
    // Implement code integrity checking
    return false; // Placeholder
  }

  private async logUsage(action: 'view' | 'copy' | 'modify'): Promise<void> {
    const usageData: UsageData = {
      timestamp: Date.now(),
      domain: window.location.hostname,
      ip: await this.getIPAddress(),
      userAgent: navigator.userAgent,
      location: await this.getLocation(),
      action
    };

    this.usageLogs.push(usageData);
    await this.reportUsage(usageData);
  }

  private async getIPAddress(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  private async getLocation(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return `${data.city}, ${data.country}`;
    } catch (error) {
      return 'unknown';
    }
  }

  private async reportUsage(data: UsageData): Promise<void> {
    try {
      await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tracking-ID': WATERMARK.trackingId
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Failed to report usage:', error);
    }
  }

  public getUsageLogs(): UsageData[] {
    return this.usageLogs;
  }

  public async getSecurityEvents(): Promise<UsageData[]> {
    // Filter for security-relevant events (modify actions)
    return this.usageLogs.filter(log => log.action === 'modify');
  }

  public async getActiveUsers(): Promise<number> {
    // Get unique IPs from the last 24 hours
    const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
    const recentLogs = this.usageLogs.filter(log => log.timestamp > last24Hours);
    const uniqueIPs = new Set(recentLogs.map(log => log.ip));
    return uniqueIPs.size;
  }
}

export const monitoringService = MonitoringService.getInstance(); 