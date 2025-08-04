import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  /**
   * Send client error notification email
   * @param {Object} clientInfo - Client information
   * @param {string} errorType - Type of error
   * @param {string} errorMessage - Actual error message
   * @param {Object} requestInfo - Request information
   */
  async sendClientErrorNotification(clientInfo, errorType, errorMessage, requestInfo) {
    try {
      // Skip sending email if no transporter is configured
      if (!this.transporter) {
        console.log('Email service not configured - skipping email notification');
        return;
      }

      const subject = `${clientInfo.name} - API Service Issue Alert`;

      const htmlContent = this.generateErrorEmailTemplate(
        clientInfo,
        errorType,
        errorMessage,
        requestInfo
      );

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || 'noreply@zigtech.net',
        to: clientInfo.email,
        cc: process.env.ADMIN_EMAIL || 'admin@zigtech.net',
        subject: subject,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail - don't let email errors affect API responses
    }
  }

  /**
   * Get user-friendly error message based on error type
   * @param {string} errorType - Type of error
   * @returns {string} User-friendly message
   */
  getUserFriendlyMessage(errorType) {
    const messages = {
      'INSUFFICIENT_BALANCE': 'Your account balance is insufficient to complete this transaction. Please top up your account or contact support.',
      'ACCOUNT_INACTIVE': 'Your account is currently inactive. Please contact support to reactivate your account.',
      'API_KEY_EXPIRED': 'Your API key has expired. Please renew your API key or contact support.',
      'IP_RESTRICTION_VIOLATION': 'API access is restricted from your current IP address. Please contact support to update your authorized IP addresses.',
      'UNAUTHORIZED_AIRTIME_ACCESS': 'Your API key does not have access to airtime services. Please contact support to upgrade your subscription.',
      'UNAUTHORIZED_CASHPOWER_ACCESS': 'Your API key does not have access to electricity token services. Please contact support to upgrade your subscription.',
      'METER_VALIDATION_ERROR': 'The meter number provided is invalid or not found. Please verify the meter number and try again.',
      'WALLET_ERROR': 'There was an issue processing your payment. Please try again or contact support.',
      'PROVIDER_ERROR': 'Our payment provider is experiencing issues. Please try again later.',
      'TRANSACTION_FAILED': 'Transaction could not be completed. Please try again or contact support.',
      'SERVICE_ERROR': 'Our service is temporarily experiencing issues. Please try again later.'
    };

    return messages[errorType] || 'Please contact support for assistance with your account.';
  }

  /**
   * Send system alert email (for balance monitoring and system notifications)
   * @param {string} email - Recipient email
   * @param {string} subject - Email subject
   * @param {string} htmlContent - HTML content
   */
  async sendSystemAlert(email, subject, htmlContent) {
    try {
      // Skip sending email if no transporter is configured
      if (!this.transporter) {
        return;
      }

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || 'system@zigtech.net',
        to: email,
        subject: subject,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail - don't let email errors affect monitoring
    }
  }

  /**
   * Get error priority for styling
   * @param {string} errorType - Type of error
   * @returns {string} Priority level
   */
  getErrorPriority(errorType) {
    const priorities = {
      'INSUFFICIENT_BALANCE': 'high',
      'ACCOUNT_INACTIVE': 'high',
      'API_KEY_EXPIRED': 'medium',
      'IP_RESTRICTION_VIOLATION': 'medium',
      'UNAUTHORIZED_AIRTIME_ACCESS': 'medium',
      'UNAUTHORIZED_CASHPOWER_ACCESS': 'medium',
      'METER_VALIDATION_ERROR': 'medium',
      'WALLET_ERROR': 'high',
      'PROVIDER_ERROR': 'medium',
      'TRANSACTION_FAILED': 'medium',
      'SERVICE_ERROR': 'high'
    };

    return priorities[errorType] || 'medium';
  }

  /**
   * Send password change notification
   * @param {string} email - Recipient email
   * @param {string} clientName - Client name
   * @param {string} ipAddress - IP address where change was made
   */
  async sendPasswordChangeNotification(email, clientName, ipAddress) {
    try {
      if (!this.transporter) return;

      const subject = 'Password Change Notification - iUtility Account';
      const htmlContent = this.generatePasswordChangeEmail(clientName, ipAddress);

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || 'security@zigtech.net',
        to: email,
        subject: subject,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Generate error email template
   * @param {Object} clientInfo - Client information
   * @param {string} errorType - Type of error
   * @param {string} errorMessage - Actual error message
   * @param {Object} requestInfo - Request information
   * @returns {string} HTML email content
   */
  generateErrorEmailTemplate(clientInfo, errorType, errorMessage, requestInfo) {
    const priority = this.getErrorPriority(errorType);
    const userFriendlyMessage = this.getUserFriendlyMessage(errorType);
    const actionItems = this.getActionItems(errorType);

    const priorityColors = {
      high: '#dc3545',
      medium: '#ffc107',
      low: '#17a2b8'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Service Issue Alert</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
          .header { background-color: ${priorityColors[priority]}; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .error-details { background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .request-info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .action-items { background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Service Issue Alert</h1>
          </div>
          <div class="content">
            <p>Dear ${clientInfo.name},</p>
            <p>We detected an issue with your iUtility API service.</p>
            
            <div class="error-details">
              <h3>Issue Details:</h3>
              <ul>
                <li><strong>Error Type:</strong> ${errorType}</li>
                <li><strong>Message:</strong> ${userFriendlyMessage}</li>
                <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</li>
              </ul>
            </div>
            
            <div class="request-info">
              <h3>Request Information:</h3>
              <ul>
                <li><strong>Endpoint:</strong> ${requestInfo?.endpoint || 'N/A'}</li>
                <li><strong>Method:</strong> ${requestInfo?.method || 'N/A'}</li>
                <li><strong>IP Address:</strong> ${requestInfo?.ipAddress || 'N/A'}</li>
                <li><strong>API Key:</strong> ${requestInfo?.apiKeyName || 'N/A'}</li>
                ${requestInfo?.amount ? `<li><strong>Amount:</strong> D${requestInfo.amount}</li>` : ''}
                ${requestInfo?.phoneNumber ? `<li><strong>Phone Number:</strong> ${requestInfo.phoneNumber}</li>` : ''}
                ${requestInfo?.meterNumber ? `<li><strong>Meter Number:</strong> ${requestInfo.meterNumber}</li>` : ''}
                ${requestInfo?.provider ? `<li><strong>Provider:</strong> ${requestInfo.provider}</li>` : ''}
              </ul>
            </div>
            
            <div class="action-items">
              <h3>Recommended Actions:</h3>
              <ul>
                ${actionItems.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
            
            <p>If you need assistance, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>This is an automated alert from the iUtility API Service.</p>
            <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get action items based on error type
   * @param {string} errorType - Type of error
   * @returns {Array} List of action items
   */
  getActionItems(errorType) {
    const actionItems = {
      'INSUFFICIENT_BALANCE': [
        'Top up your wallet balance',
        'Check your current balance',
        'Contact support for assistance'
      ],
      'ACCOUNT_INACTIVE': [
        'Contact support to reactivate your account',
        'Verify your account status',
        'Check for any outstanding issues'
      ],
      'API_KEY_EXPIRED': [
        'Renew your API key',
        'Generate a new API key',
        'Contact support for assistance'
      ],
      'IP_RESTRICTION_VIOLATION': [
        'Contact support to update authorized IP addresses',
        'Verify your current IP address',
        'Check your API key configuration'
      ],
      'UNAUTHORIZED_AIRTIME_ACCESS': [
        'Contact support to upgrade your subscription',
        'Verify your service permissions',
        'Check your API key configuration'
      ],
      'UNAUTHORIZED_CASHPOWER_ACCESS': [
        'Contact support to upgrade your subscription',
        'Verify your service permissions',
        'Check your API key configuration'
      ],
      'METER_VALIDATION_ERROR': [
        'Verify the meter number is correct',
        'Check if the meter is active',
        'Contact support for assistance'
      ],
      'WALLET_ERROR': [
        'Try the transaction again',
        'Check your wallet balance',
        'Contact support if the issue persists'
      ],
      'PROVIDER_ERROR': [
        'Try the transaction again later',
        'Check our service status',
        'Contact support if the issue persists'
      ],
      'TRANSACTION_FAILED': [
        'Try the transaction again',
        'Verify your request parameters',
        'Contact support if the issue persists'
      ],
      'SERVICE_ERROR': [
        'Try again later',
        'Check our service status',
        'Contact support if the issue persists'
      ]
    };

    return actionItems[errorType] || [
      'Contact support for assistance',
      'Check your account status',
      'Verify your API configuration'
    ];
  }

  /**
   * Send client password reset email
   * @param {string} email - Recipient email
   * @param {string} clientName - Client name
   * @param {string} resetToken - Reset token
   */
  async sendClientPasswordReset(email, clientName, resetToken) {
    try {
      if (!this.transporter) return;

      const subject = 'Password Reset Request - iUtility Account';
      const resetLink = `${process.env.CLIENT_PORTAL_URL}/reset-password?token=${resetToken}`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .reset-button { display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Dear ${clientName},</p>
              <p>You requested a password reset for your iUtility account.</p>
              
              <p>Click the button below to reset your password:</p>
              <a href="${resetLink}" class="reset-button">Reset Password</a>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p>${resetLink}</p>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>For security, this link can only be used once</li>
              </ul>
            </div>
            <div class="footer">
              <p>This is an automated message from the iUtility system.</p>
              <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || 'security@zigtech.net',
        to: email,
        subject: subject,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Send client password change confirmation
   * @param {string} email - Recipient email
   * @param {string} clientName - Client name
   * @param {string} ipAddress - IP address where change was made
   */
  async sendClientPasswordChangeConfirmation(email, clientName, ipAddress) {
    try {
      if (!this.transporter) return;

      const subject = 'Password Changed Successfully - iUtility Account';
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Changed</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .info-box { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Changed Successfully</h1>
            </div>
            <div class="content">
              <p>Dear ${clientName},</p>
              <p>Your iUtility account password has been changed successfully.</p>
              
              <div class="info-box">
                <h3>Change Details:</h3>
                <ul>
                  <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</li>
                  <li><strong>IP Address:</strong> ${ipAddress}</li>
                  <li><strong>Status:</strong> Successfully changed</li>
                </ul>
              </div>
              
              <p><strong>Security Notice:</strong></p>
              <ul>
                <li>If you didn't make this change, contact support immediately</li>
                <li>Consider enabling two-factor authentication for additional security</li>
                <li>Keep your password secure and don't share it with others</li>
              </ul>
            </div>
            <div class="footer">
              <p>This is an automated message from the iUtility system.</p>
              <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || 'security@zigtech.net',
        to: email,
        subject: subject,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Send manual airtime request submitted notification
   * @param {string} email - Recipient email
   * @param {string} clientName - Client name
   * @param {string} requestId - Request ID
   * @param {number} amount - Requested amount
   * @param {string} paymentMethod - Payment method
   */
  async sendManualAirtimeRequestSubmitted(email, clientName, requestId, amount, paymentMethod) {
    try {
      if (!this.transporter) return;

      const subject = 'Manual Airtime Request Submitted - iUtility';
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Manual Airtime Request</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
            .header { background-color: #17a2b8; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .request-details { background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Manual Airtime Request Submitted</h1>
            </div>
            <div class="content">
              <p>Dear ${clientName},</p>
              <p>Your manual airtime request has been submitted successfully.</p>
              
              <div class="request-details">
                <h3>Request Details:</h3>
                <ul>
                  <li><strong>Request ID:</strong> ${requestId}</li>
                  <li><strong>Amount:</strong> D${amount}</li>
                  <li><strong>Payment Method:</strong> ${paymentMethod}</li>
                  <li><strong>Status:</strong> Pending Approval</li>
                  <li><strong>Submitted:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</li>
                </ul>
              </div>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Upload your payment receipt</li>
                <li>Wait for admin approval</li>
                <li>You'll receive a notification once approved</li>
              </ul>
            </div>
            <div class="footer">
              <p>This is an automated message from the iUtility system.</p>
              <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || 'noreply@zigtech.net',
        to: email,
        subject: subject,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Send manual airtime request approved notification
   * @param {string} email - Recipient email
   * @param {string} clientName - Client name
   * @param {string} requestId - Request ID
   * @param {number} approvedAmount - Approved amount
   * @param {number} newBalance - New wallet balance
   */
  async sendManualAirtimeRequestApproved(email, clientName, requestId, approvedAmount, newBalance) {
    try {
      if (!this.transporter) return;

      const subject = 'Manual Airtime Request Approved - iUtility';
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Manual Airtime Request Approved</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .approval-details { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Manual Airtime Request Approved</h1>
            </div>
            <div class="content">
              <p>Dear ${clientName},</p>
              <p>Your manual airtime request has been approved!</p>
              
              <div class="approval-details">
                <h3>Approval Details:</h3>
                <ul>
                  <li><strong>Request ID:</strong> ${requestId}</li>
                  <li><strong>Approved Amount:</strong> D${approvedAmount}</li>
                  <li><strong>New Wallet Balance:</strong> D${newBalance}</li>
                  <li><strong>Approved:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</li>
                </ul>
              </div>
              
              <p>Your wallet has been credited and you can now use the airtime services.</p>
            </div>
            <div class="footer">
              <p>This is an automated message from the iUtility system.</p>
              <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || 'noreply@zigtech.net',
        to: email,
        subject: subject,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Send manual airtime request rejected notification
   * @param {string} email - Recipient email
   * @param {string} clientName - Client name
   * @param {string} requestId - Request ID
   * @param {number} requestedAmount - Requested amount
   * @param {string} rejectionReason - Rejection reason
   */
  async sendManualAirtimeRequestRejected(email, clientName, requestId, requestedAmount, rejectionReason) {
    try {
      if (!this.transporter) return;

      const subject = 'Manual Airtime Request Rejected - iUtility';
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Manual Airtime Request Rejected</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
            .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .rejection-details { background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Manual Airtime Request Rejected</h1>
            </div>
            <div class="content">
              <p>Dear ${clientName},</p>
              <p>Your manual airtime request has been rejected.</p>
              
              <div class="rejection-details">
                <h3>Rejection Details:</h3>
                <ul>
                  <li><strong>Request ID:</strong> ${requestId}</li>
                  <li><strong>Requested Amount:</strong> D${requestedAmount}</li>
                  <li><strong>Rejection Reason:</strong> ${rejectionReason}</li>
                  <li><strong>Rejected:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</li>
                </ul>
              </div>
              
              <p>Please contact support if you have any questions about this rejection.</p>
            </div>
            <div class="footer">
              <p>This is an automated message from the iUtility system.</p>
              <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || 'noreply@zigtech.net',
        to: email,
        subject: subject,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Send admin notification
   * @param {string} notificationType - Type of notification
   * @param {Object} data - Notification data
   */
  async sendAdminNotification(notificationType, data) {
    try {
      if (!this.transporter) return;

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@zigtech.net';
      const subject = `Admin Notification - ${notificationType}`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Admin Notification</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
            .header { background-color: #6c757d; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .data-details { background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Admin Notification</h1>
            </div>
            <div class="content">
              <p>Notification Type: ${notificationType}</p>
              
              <div class="data-details">
                <h3>Notification Data:</h3>
                <pre>${JSON.stringify(data, null, 2)}</pre>
              </div>
              
              <p>Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
            </div>
            <div class="footer">
              <p>This is an automated message from the iUtility system.</p>
              <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || 'system@zigtech.net',
        to: adminEmail,
        subject: subject,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Send client notification
   * @param {string} clientId - Client ID
   * @param {string} notificationType - Type of notification
   * @param {Object} data - Notification data
   */
  async sendClientNotification(clientId, notificationType, data) {
    try {
      if (!this.transporter) return;

      // Get client info from database
      const { Client } = await import('../models/index.js');
      const client = await Client.findByPk(clientId);

      if (!client) return;

      const subject = `iUtility Notification - ${notificationType}`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Client Notification</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .data-details { background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>iUtility Notification</h1>
            </div>
            <div class="content">
              <p>Dear ${client.name},</p>
              <p>You have received a notification from iUtility.</p>
              
              <div class="data-details">
                <h3>Notification Details:</h3>
                <pre>${JSON.stringify(data, null, 2)}</pre>
              </div>
              
              <p>Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
            </div>
            <div class="footer">
              <p>This is an automated message from the iUtility system.</p>
              <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Banjul' })}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || 'noreply@zigtech.net',
        to: client.email,
        subject: subject,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Send generic email
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} html - HTML content
   * @param {string} text - Text content
   */
  async sendEmail(to, subject, html, text) {
    try {
      if (!this.transporter) return;

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || 'noreply@zigtech.net',
        to: to,
        subject: subject,
        html: html,
        text: text
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail
    }
  }
}

export default new EmailService();
