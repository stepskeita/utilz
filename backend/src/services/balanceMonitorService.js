import cron from 'node-cron';
import gamSwitchService from './gamSwitchService.js';
import emailService from './emailService.js';

class BalanceMonitorService {
  constructor() {
    this.isRunning = false;
    this.lastBalance = null;

    // Configurable thresholds from environment variables
    this.thresholds = {
      critical: parseFloat(process.env.BALANCE_CRITICAL_THRESHOLD) || 100,  // D100
      warning: parseFloat(process.env.BALANCE_WARNING_THRESHOLD) || 500,    // D500
      low: parseFloat(process.env.BALANCE_LOW_THRESHOLD) || 1000            // D1000
    };

    // System notification emails from environment variables
    this.systemEmails = process.env.SYSTEM_NOTIFICATION_EMAILS
      ? process.env.SYSTEM_NOTIFICATION_EMAILS.split(',').map(email => email.trim())
      : ['fceesay@zigtech.net', 'akeita@zigtech.net', 'dladipo@zigtech.net'];
  }

  /**
   * Start the balance monitoring cron job
   */
  start() {
    if (this.isRunning) {
      console.log('Balance monitor is already running');
      return;
    }

    this.businessHoursCronJob = cron.schedule('0 * * * *', async () => {
      await this.checkBalance();
    }, {
      scheduled: true,
      timezone: 'Africa/Banjul'
    });

    this.isRunning = true;

    // Run initial check
    setTimeout(() => this.checkBalance(), 5000);
  }

  /**
   * Stop the balance monitoring cron job
   */
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob.destroy();
    }
    if (this.businessHoursCronJob) {
      this.businessHoursCronJob.stop();
      this.businessHoursCronJob.destroy();
    }
    if (this.dailyReportCronJob) {
      this.dailyReportCronJob.stop();
      this.dailyReportCronJob.destroy();
    }

    this.isRunning = false;
    console.log('Balance monitor stopped');
  }

  /**
   * Check GamSwitch balance and send alerts if needed
   */
  async checkBalance() {
    try {
      console.log('🔍 Checking GamSwitch balance...');

      const balanceResult = await gamSwitchService.checkBalance();

      if (balanceResult.success) {
        const currentBalance = balanceResult.balance;

        // Check if balance is valid
        if (isNaN(currentBalance)) {
          console.log('⚠️ Invalid balance received from GamSwitch API');
          await this.sendServiceAlert('INVALID_BALANCE', `Received invalid balance data: ${JSON.stringify(balanceResult.data)}`);
          return;
        }

        console.log(`💰 Current GamSwitch balance: ${balanceResult.currency} ${currentBalance.toFixed(2)}`);

        // Determine alert level
        const alertLevel = this.getAlertLevel(currentBalance);

        // Send alert if balance is below thresholds
        if (alertLevel !== 'normal') {
          await this.sendBalanceAlert(currentBalance, balanceResult.currency, alertLevel);
        }

        // Check for significant balance changes (drop of more than D500)
        if (this.lastBalance && !isNaN(this.lastBalance) && this.lastBalance - currentBalance > 500) {
          await this.sendBalanceChangeAlert(this.lastBalance, currentBalance, balanceResult.currency);
        }

        // Update last balance
        this.lastBalance = currentBalance;
      } else {
        console.log('❌ Failed to check balance:', balanceResult.data?.responseDescription || 'Unknown error');
        await this.sendServiceAlert('BALANCE_CHECK_FAILED', `Failed to check balance: ${JSON.stringify(balanceResult.data)}`);
      }
    } catch (error) {
      console.error('❌ Error checking balance:', error);
      await this.sendServiceAlert('BALANCE_CHECK_ERROR', `Error checking balance: ${error.message}`);
    }
  }

  /**
   * Determine alert level based on balance
   */
  getAlertLevel(balance) {
    if (balance <= this.thresholds.critical) return 'critical';
    if (balance <= this.thresholds.warning) return 'warning';
    if (balance <= this.thresholds.low) return 'low';
    return 'normal';
  }

  /**
   * Send balance alert email
   */
  async sendBalanceAlert(balance, currency, alertLevel) {
    try {
      const emailContent = this.generateBalanceAlertEmail(balance, currency, alertLevel);

      for (const email of this.systemEmails) {
        await emailService.sendEmail(
          email,
          emailContent.subject,
          emailContent.html,
          emailContent.text
        );
      }

      console.log(`📧 Balance alert sent (${alertLevel}): ${currency} ${balance.toFixed(2)}`);
    } catch (error) {
      console.error('❌ Error sending balance alert:', error);
    }
  }

  /**
   * Send balance change alert
   */
  async sendBalanceChangeAlert(previousBalance, currentBalance, currency) {
    try {
      const difference = previousBalance - currentBalance;
      const emailContent = this.generateBalanceChangeEmail(previousBalance, currentBalance, currency, difference);

      for (const email of this.systemEmails) {
        await emailService.sendEmail(
          email,
          emailContent.subject,
          emailContent.html,
          emailContent.text
        );
      }

      console.log(`📧 Balance change alert sent: ${currency} ${difference.toFixed(2)} decrease`);
    } catch (error) {
      console.error('❌ Error sending balance change alert:', error);
    }
  }

  /**
   * Send service alert
   */
  async sendServiceAlert(errorType, errorMessage) {
    try {
      const emailContent = this.generateServiceAlertEmail(errorType, errorMessage);

      for (const email of this.systemEmails) {
        await emailService.sendEmail(
          email,
          emailContent.subject,
          emailContent.html,
          emailContent.text
        );
      }

      console.log(`📧 Service alert sent: ${errorType}`);
    } catch (error) {
      console.error('❌ Error sending service alert:', error);
    }
  }

  /**
   * Send daily balance report
   */
  async sendDailyBalanceReport() {
    try {
      const balanceResult = await gamSwitchService.checkBalance();
      const emailContent = this.generateDailyReportEmail(balanceResult);

      for (const email of this.systemEmails) {
        await emailService.sendEmail(
          email,
          emailContent.subject,
          emailContent.html,
          emailContent.text
        );
      }

      console.log('📧 Daily balance report sent');
    } catch (error) {
      console.error('❌ Error sending daily balance report:', error);
    }
  }

  /**
   * Generate balance alert email content
   */
  generateBalanceAlertEmail(balance, currency, alertLevel) {
    const alertEmojis = {
      critical: '🚨',
      warning: '⚠️',
      low: '📉'
    };

    const alertColors = {
      critical: '#dc3545',
      warning: '#ffc107',
      low: '#17a2b8'
    };

    const alertTitles = {
      critical: 'CRITICAL BALANCE ALERT',
      warning: 'WARNING BALANCE ALERT',
      low: 'LOW BALANCE ALERT'
    };

    const subject = `${alertEmojis[alertLevel]} ${alertTitles[alertLevel]} - ${currency} ${balance.toFixed(2)}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
        <title>${alertTitles[alertLevel]}</title>
      <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
          .header { background-color: ${alertColors[alertLevel]}; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .balance { font-size: 24px; font-weight: bold; color: ${alertColors[alertLevel]}; text-align: center; margin: 20px 0; }
          .details { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
            <h1>${alertTitles[alertLevel]}</h1>
        </div>
        <div class="content">
            <p>Dear System Administrator,</p>
            <p>The GamSwitch account balance has reached a ${alertLevel} level.</p>
          
            <div class="balance">
              Current Balance: ${currency} ${balance.toFixed(2)}
          </div>
          
            <div class="details">
              <h3>Alert Details:</h3>
              <ul>
                <li><strong>Alert Level:</strong> ${alertLevel.toUpperCase()}</li>
                <li><strong>Current Balance:</strong> ${currency} ${balance.toFixed(2)}</li>
                <li><strong>Threshold:</strong> ${currency} ${this.thresholds[alertLevel]}</li>
                <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</li>
              </ul>
            </div>
            
            <p><strong>Action Required:</strong></p>
            <ul>
              <li>Please top up the GamSwitch account immediately</li>
              <li>Monitor the balance closely</li>
              <li>Check for any unusual transaction patterns</li>
            </ul>
          </div>
          <div class="footer">
            <p>This is an automated alert from the iUtility Balance Monitor System.</p>
            <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const text = `
${alertTitles[alertLevel]}

Dear System Administrator,

The GamSwitch account balance has reached a ${alertLevel} level.

Current Balance: ${currency} ${balance.toFixed(2)}

Alert Details:
- Alert Level: ${alertLevel.toUpperCase()}
- Current Balance: ${currency} ${balance.toFixed(2)}
- Threshold: ${currency} ${this.thresholds[alertLevel]}
- Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}

Action Required:
- Please top up the GamSwitch account immediately
- Monitor the balance closely
- Check for any unusual transaction patterns

This is an automated alert from the iUtility Balance Monitor System.
Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}
    `;

    return { subject, html, text };
  }

  /**
   * Generate balance change alert email content
   */
  generateBalanceChangeEmail(previousBalance, currentBalance, currency, difference) {
    const subject = `📉 SIGNIFICANT BALANCE DECREASE - ${currency} ${difference.toFixed(2)}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
        <title>Significant Balance Decrease</title>
      <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
          .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .change { font-size: 24px; font-weight: bold; color: #dc3545; text-align: center; margin: 20px 0; }
          .details { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
            <h1>Significant Balance Decrease</h1>
        </div>
        <div class="content">
            <p>Dear System Administrator,</p>
            <p>The GamSwitch account balance has decreased significantly.</p>
            
            <div class="change">
              Decrease: ${currency} ${difference.toFixed(2)}
          </div>
          
            <div class="details">
              <h3>Balance Details:</h3>
              <ul>
                <li><strong>Previous Balance:</strong> ${currency} ${previousBalance.toFixed(2)}</li>
                <li><strong>Current Balance:</strong> ${currency} ${currentBalance.toFixed(2)}</li>
                <li><strong>Decrease:</strong> ${currency} ${difference.toFixed(2)}</li>
                <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</li>
              </ul>
        </div>
        
            <p><strong>Action Required:</strong></p>
            <ul>
              <li>Review recent transactions</li>
              <li>Check for any unusual activity</li>
              <li>Consider topping up if necessary</li>
            </ul>
          </div>
        <div class="footer">
            <p>This is an automated alert from the iUtility Balance Monitor System.</p>
            <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
          </div>
      </div>
    </body>
    </html>
    `;

    const text = `
Significant Balance Decrease

Dear System Administrator,

The GamSwitch account balance has decreased significantly.

Decrease: ${currency} ${difference.toFixed(2)}

Balance Details:
- Previous Balance: ${currency} ${previousBalance.toFixed(2)}
- Current Balance: ${currency} ${currentBalance.toFixed(2)}
- Decrease: ${currency} ${difference.toFixed(2)}
- Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}

Action Required:
- Review recent transactions
- Check for any unusual activity
- Consider topping up if necessary

This is an automated alert from the iUtility Balance Monitor System.
Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}
    `;

    return { subject, html, text };
  }

  /**
   * Generate service alert email content
   */
  generateServiceAlertEmail(errorType, errorMessage) {
    const subject = `🚨 SERVICE ALERT - ${errorType}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
        <title>Service Alert</title>
      <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
          .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .error { background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
            <h1>Service Alert</h1>
          </div>
          <div class="content">
            <p>Dear System Administrator,</p>
            <p>A service alert has been triggered in the iUtility Balance Monitor System.</p>
            
            <div class="error">
              <h3>Error Details:</h3>
              <ul>
                <li><strong>Error Type:</strong> ${errorType}</li>
                <li><strong>Error Message:</strong> ${errorMessage}</li>
                <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</li>
              </ul>
        </div>
        
            <p><strong>Action Required:</strong></p>
            <ul>
              <li>Investigate the service issue</li>
              <li>Check system logs for more details</li>
              <li>Verify GamSwitch API connectivity</li>
            </ul>
          </div>
        <div class="footer">
            <p>This is an automated alert from the iUtility Balance Monitor System.</p>
            <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
          </div>
      </div>
    </body>
    </html>
    `;

    const text = `
Service Alert

Dear System Administrator,

A service alert has been triggered in the iUtility Balance Monitor System.

Error Details:
- Error Type: ${errorType}
- Error Message: ${errorMessage}
- Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}

Action Required:
- Investigate the service issue
- Check system logs for more details
- Verify GamSwitch API connectivity

This is an automated alert from the iUtility Balance Monitor System.
Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}
    `;

    return { subject, html, text };
  }

  /**
   * Generate daily report email content
   */
  generateDailyReportEmail(balanceResult) {
    const subject = `📊 Daily Balance Report - ${new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Banjul' })}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
        <title>Daily Balance Report</title>
      <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
          .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .balance { font-size: 24px; font-weight: bold; color: #28a745; text-align: center; margin: 20px 0; }
          .details { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
            <h1>Daily Balance Report</h1>
        </div>
        <div class="content">
            <p>Dear System Administrator,</p>
            <p>Here is the daily balance report for the GamSwitch account.</p>
            
            <div class="balance">
              Current Balance: ${balanceResult.currency || 'DAL'} ${balanceResult.balance?.toFixed(2) || 'N/A'}
          </div>

            <div class="details">
              <h3>Report Details:</h3>
              <ul>
                <li><strong>Current Balance:</strong> ${balanceResult.currency || 'DAL'} ${balanceResult.balance?.toFixed(2) || 'N/A'}</li>
                <li><strong>Report Date:</strong> ${new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Banjul' })}</li>
                <li><strong>Report Time:</strong> ${new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Banjul' })}</li>
                <li><strong>Status:</strong> ${balanceResult.success ? 'Healthy' : 'Error'}</li>
              </ul>
        </div>
        
            <p><strong>System Status:</strong></p>
            <ul>
              <li>Balance monitoring is active</li>
              <li>Alerts are configured and working</li>
              <li>Daily reports are being generated</li>
            </ul>
          </div>
        <div class="footer">
            <p>This is an automated report from the iUtility Balance Monitor System.</p>
            <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
          </div>
      </div>
    </body>
    </html>
    `;

    const text = `
Daily Balance Report

Dear System Administrator,

Here is the daily balance report for the GamSwitch account.

Current Balance: ${balanceResult.currency || 'DAL'} ${balanceResult.balance?.toFixed(2) || 'N/A'}

Report Details:
- Current Balance: ${balanceResult.currency || 'DAL'} ${balanceResult.balance?.toFixed(2) || 'N/A'}
- Report Date: ${new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Banjul' })}
- Report Time: ${new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Banjul' })}
- Status: ${balanceResult.success ? 'Healthy' : 'Error'}

System Status:
- Balance monitoring is active
- Alerts are configured and working
- Daily reports are being generated

This is an automated report from the iUtility Balance Monitor System.
Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}
    `;

    return { subject, html, text };
  }
}

export default new BalanceMonitorService();
