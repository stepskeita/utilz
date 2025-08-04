/**
 * Email template for client password reset
 */
export const clientPasswordResetTemplate = (clientName, resetLink, resetToken) => {
  return {
    subject: 'Reset Your Password - iTopup Client Portal',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover {
            background-color: #2980b9;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>iTopup Client Portal</h1>
          <h2>Password Reset Request</h2>
        </div>
        
        <div class="content">
          <h3>Hello ${clientName},</h3>
          
          <p>We received a request to reset your password for your iTopup Client Portal account.</p>
          
          <p>If you requested this password reset, click the button below to set a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Reset My Password</a>
          </div>
          
          <p>Alternatively, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background-color: #e9ecef; padding: 10px; border-radius: 3px;">
            ${resetLink}
          </p>
          
          <div class="warning">
            <strong>Important:</strong>
            <ul>
              <li>This link will expire in 1 hour for security reasons</li>
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>Your password will remain unchanged until you use this link</li>
            </ul>
          </div>
          
          <p>For security reasons, please don't share this email or link with anyone.</p>
          
          <p>If you're having trouble clicking the button, or if you didn't request this reset, please contact our support team immediately.</p>
          
          <p>Best regards,<br>
          The iTopup Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} iTopup. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      iTopup Client Portal - Password Reset Request
      
      Hello ${clientName},
      
      We received a request to reset your password for your iTopup Client Portal account.
      
      If you requested this password reset, use the following link to set a new password:
      ${resetLink}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
      
      For security reasons, please don't share this link with anyone.
      
      If you're having trouble with the link, or if you didn't request this reset, please contact our support team immediately.
      
      Best regards,
      The iTopup Team
      
      This is an automated message, please do not reply to this email.
      © ${new Date().getFullYear()} iTopup. All rights reserved.
    `
  };
};

/**
 * Email template for successful password change
 */
export const clientPasswordChangeConfirmationTemplate = (clientName, changeTime, ipAddress) => {
  return {
    subject: 'Password Changed Successfully - iTopup Client Portal',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #27ae60;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .info-box {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>iTopup Client Portal</h1>
          <h2>Password Changed Successfully</h2>
        </div>
        
        <div class="content">
          <h3>Hello ${clientName},</h3>
          
          <p>Your password has been successfully changed for your iTopup Client Portal account.</p>
          
          <div class="info-box">
            <strong>Change Details:</strong>
            <ul>
              <li><strong>Date & Time:</strong> ${changeTime}</li>
              <li><strong>IP Address:</strong> ${ipAddress}</li>
            </ul>
          </div>
          
          <p>If you made this change, no further action is required.</p>
          
          <div class="warning">
            <strong>If you did not change your password:</strong>
            <ul>
              <li>Your account security may be compromised</li>
              <li>Please contact our support team immediately</li>
              <li>Consider reviewing your account activity</li>
            </ul>
          </div>
          
          <p>For your security, we recommend:</p>
          <ul>
            <li>Using a strong, unique password</li>
            <li>Not sharing your login credentials with anyone</li>
            <li>Logging out of shared devices</li>
            <li>Monitoring your account regularly</li>
          </ul>
          
          <p>Thank you for keeping your account secure.</p>
          
          <p>Best regards,<br>
          The iTopup Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated security notification, please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} iTopup. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      iTopup Client Portal - Password Changed Successfully
      
      Hello ${clientName},
      
      Your password has been successfully changed for your iTopup Client Portal account.
      
      Change Details:
      - Date & Time: ${changeTime}
      - IP Address: ${ipAddress}
      
      If you made this change, no further action is required.
      
      If you did not change your password:
      - Your account security may be compromised
      - Please contact our support team immediately
      - Consider reviewing your account activity
      
      For your security, we recommend:
      - Using a strong, unique password
      - Not sharing your login credentials with anyone
      - Logging out of shared devices
      - Monitoring your account regularly
      
      Thank you for keeping your account secure.
      
      Best regards,
      The iTopup Team
      
      This is an automated security notification, please do not reply to this email.
      © ${new Date().getFullYear()} iTopup. All rights reserved.
    `
  };
};

/**
 * Email template for wallet top-up request submitted
 */
export const topUpRequestSubmittedTemplate = (clientName, requestId, amount, paymentMethod) => {
  return {
    subject: 'Wallet Top-up Request Submitted - iTopup Client Portal',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Top-up Request Submitted</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f39c12;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .info-box {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>iTopup Client Portal</h1>
          <h2>Top-up Request Submitted</h2>
        </div>
        
        <div class="content">
          <h3>Hello ${clientName},</h3>
          
          <p>Your wallet top-up request has been successfully submitted and is now pending review.</p>
          
          <div class="info-box">
            <strong>Request Details:</strong>
            <ul>
              <li><strong>Request ID:</strong> ${requestId}</li>
              <li><strong>Amount:</strong> ${amount} GMD</li>
              <li><strong>Payment Method:</strong> ${paymentMethod}</li>
              <li><strong>Status:</strong> Pending Review</li>
            </ul>
          </div>
          
          <p>What happens next:</p>
          <ul>
            <li>Our admin team will review your request and supporting documents</li>
            <li>You'll receive an email notification once the request is processed</li>
            <li>If approved, the funds will be added to your wallet balance</li>
            <li>Processing typically takes 1-2 business days</li>
          </ul>
          
          <p>You can track the status of your request in your client portal dashboard.</p>
          
          <p>If you have any questions about your request, please contact our support team and reference your Request ID: ${requestId}</p>
          
          <p>Thank you for using iTopup!</p>
          
          <p>Best regards,<br>
          The iTopup Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} iTopup. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      iTopup Client Portal - Top-up Request Submitted
      
      Hello ${clientName},
      
      Your wallet top-up request has been successfully submitted and is now pending review.
      
      Request Details:
      - Request ID: ${requestId}
      - Amount: ${amount} GMD
      - Payment Method: ${paymentMethod}
      - Status: Pending Review
      
      What happens next:
      - Our admin team will review your request and supporting documents
      - You'll receive an email notification once the request is processed
      - If approved, the funds will be added to your wallet balance
      - Processing typically takes 1-2 business days
      
      You can track the status of your request in your client portal dashboard.
      
      If you have any questions about your request, please contact our support team and reference your Request ID: ${requestId}
      
      Thank you for using iTopup!
      
      Best regards,
      The iTopup Team
      
      This is an automated message, please do not reply to this email.
      © ${new Date().getFullYear()} iTopup. All rights reserved.
    `
  };
};

/**
 * Email template for wallet top-up request approved
 */
export const topUpRequestApprovedTemplate = (clientName, requestId, approvedAmount, newBalance) => {
  return {
    subject: 'Wallet Top-up Request Approved - iTopup Client Portal',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Top-up Request Approved</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #27ae60;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .success-box {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .amount {
            font-size: 24px;
            font-weight: bold;
            color: #27ae60;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>iTopup Client Portal</h1>
          <h2>🎉 Top-up Request Approved!</h2>
        </div>
        
        <div class="content">
          <h3>Great news, ${clientName}!</h3>
          
          <p>Your wallet top-up request has been approved and the funds have been added to your account.</p>
          
          <div class="success-box">
            <strong>Approval Details:</strong>
            <ul>
              <li><strong>Request ID:</strong> ${requestId}</li>
              <li><strong>Approved Amount:</strong> ${approvedAmount} GMD</li>
              <li><strong>New Wallet Balance:</strong> ${newBalance} GMD</li>
            </ul>
          </div>
          
          <div class="amount">
            + ${approvedAmount} GMD
          </div>
          
          <p>Your funds are now available for use. You can:</p>
          <ul>
            <li>Start making top-up transactions immediately</li>
            <li>View your updated balance in the client portal</li>
            <li>Track your transaction history</li>
          </ul>
          
          <p>Thank you for choosing iTopup for your mobile top-up needs!</p>
          
          <p>Best regards,<br>
          The iTopup Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} iTopup. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      iTopup Client Portal - Top-up Request Approved!
      
      Great news, ${clientName}!
      
      Your wallet top-up request has been approved and the funds have been added to your account.
      
      Approval Details:
      - Request ID: ${requestId}
      - Approved Amount: ${approvedAmount} GMD
      - New Wallet Balance: ${newBalance} GMD
      
      Your funds are now available for use. You can:
      - Start making top-up transactions immediately
      - View your updated balance in the client portal
      - Track your transaction history
      
      Thank you for choosing iTopup for your mobile top-up needs!
      
      Best regards,
      The iTopup Team
      
      This is an automated message, please do not reply to this email.
      © ${new Date().getFullYear()} iTopup. All rights reserved.
    `
  };
};

/**
 * Email template for wallet top-up request rejected
 */
export const topUpRequestRejectedTemplate = (clientName, requestId, requestedAmount, rejectionReason) => {
  return {
    subject: 'Wallet Top-up Request Update - iTopup Client Portal',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Top-up Request Update</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #e74c3c;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .info-box {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .next-steps {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>iTopup Client Portal</h1>
          <h2>Top-up Request Update</h2>
        </div>
        
        <div class="content">
          <h3>Hello ${clientName},</h3>
          
          <p>We have reviewed your wallet top-up request and unfortunately cannot approve it at this time.</p>
          
          <div class="info-box">
            <strong>Request Details:</strong>
            <ul>
              <li><strong>Request ID:</strong> ${requestId}</li>
              <li><strong>Requested Amount:</strong> ${requestedAmount} GMD</li>
              <li><strong>Status:</strong> Not Approved</li>
            </ul>
          </div>
          
          <p><strong>Reason:</strong></p>
          <div style="background-color: #fff; padding: 15px; border-left: 4px solid #e74c3c; margin: 15px 0;">
            ${rejectionReason}
          </div>
          
          <div class="next-steps">
            <strong>Next Steps:</strong>
            <ul>
              <li>Review the reason provided above</li>
              <li>Ensure all requirements are met for your next request</li>
              <li>Contact our support team if you need clarification</li>
              <li>You can submit a new request once any issues are resolved</li>
            </ul>
          </div>
          
          <p>We appreciate your understanding and look forward to processing your future requests.</p>
          
          <p>If you have any questions about this decision, please contact our support team and reference Request ID: ${requestId}</p>
          
          <p>Best regards,<br>
          The iTopup Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} iTopup. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      iTopup Client Portal - Top-up Request Update
      
      Hello ${clientName},
      
      We have reviewed your wallet top-up request and unfortunately cannot approve it at this time.
      
      Request Details:
      - Request ID: ${requestId}
      - Requested Amount: ${requestedAmount} GMD
      - Status: Not Approved
      
      Reason:
      ${rejectionReason}
      
      Next Steps:
      - Review the reason provided above
      - Ensure all requirements are met for your next request
      - Contact our support team if you need clarification
      - You can submit a new request once any issues are resolved
      
      We appreciate your understanding and look forward to processing your future requests.
      
      If you have any questions about this decision, please contact our support team and reference Request ID: ${requestId}
      
      Best regards,
      The iTopup Team
      
      This is an automated message, please do not reply to this email.
      © ${new Date().getFullYear()} iTopup. All rights reserved.
    `
  };
};
