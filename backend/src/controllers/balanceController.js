import balanceMonitorService from '../services/balanceMonitorService.js';
import gamSwitchService from '../services/gamSwitchService.js';

class BalanceController {
  /**
   * Manually trigger balance check
   */
  async checkBalance(req, res) {
    try {
      await balanceMonitorService.checkBalance();

      res.status(200).json({
        success: true,
        message: 'Balance check completed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to check balance',
        error: error.message
      });
    }
  }

  /**
   * Get current balance status
   */
  async getBalanceStatus(req, res) {
    try {
      const balanceResult = await gamSwitchService.checkBalance();

      if (balanceResult.success) {
        // Get alert level from monitor service
        const alertLevel = (() => {
          const balance = balanceResult.balance;
          const thresholds = balanceMonitorService.thresholds;
          if (balance <= thresholds.critical) return 'critical';
          if (balance <= thresholds.warning) return 'warning';
          if (balance <= thresholds.low) return 'low';
          return 'normal';
        })();

        res.status(200).json({
          success: true,
          data: {
            balance: balanceResult.balance,
            currency: balanceResult.currency,
            alertLevel,
            thresholds: balanceMonitorService.thresholds,
            lastChecked: new Date().toISOString()
          }
        });
      } else {
        res.status(503).json({
          success: false,
          message: 'Unable to retrieve balance from GamSwitch API'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get balance status',
        error: error.message
      });
    }
  }

  /**
   * Send test balance alert
   */
  async sendTestAlert(req, res) {
    try {
      const { alertLevel = 'warning' } = req.body;

      // Mock balance data for testing
      const mockBalance = {
        critical: 50,
        warning: 300,
        low: 800
      };

      await balanceMonitorService.sendBalanceAlert(
        mockBalance[alertLevel],
        'GMD',
        alertLevel
      );

      res.status(200).json({
        success: true,
        message: `Test ${alertLevel} alert sent successfully`,
        recipients: balanceMonitorService.systemEmails
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to send test alert',
        error: error.message
      });
    }
  }

  /**
   * Get monitoring status
   */
  async getMonitoringStatus(req, res) {
    try {
      res.status(200).json({
        success: true,
        data: {
          isRunning: balanceMonitorService.isRunning,
          systemEmails: balanceMonitorService.systemEmails,
          thresholds: balanceMonitorService.thresholds,
          lastBalance: balanceMonitorService.lastBalance,
          cronSchedule: {
            regular: 'Every 30 minutes',
            businessHours: 'Every hour (8 AM - 6 PM)',
            dailyReport: '9 AM daily'
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get monitoring status',
        error: error.message
      });
    }
  }
}

const controller = new BalanceController();

export const {
  checkBalance,
  getBalanceStatus,
  sendTestAlert,
  getMonitoringStatus
} = controller;

export default controller;
