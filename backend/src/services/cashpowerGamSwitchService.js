import axios from 'axios';
import crypto from 'crypto';

class CashpowerGamSwitchService {
  constructor() {
    this.baseURL = process.env.GAMSWITCH_BASE_URL;
    this.interchange = process.env.GAMSWITCH_INTERCHANGE;
    this.username = process.env.GAMSWITCH_USERNAME;
    this.password = process.env.GAMSWITCH_PASSWORD;
    this.hashKey = process.env.GAMSWITCH_HASH_KEY;
    this.securityKey = process.env.GAMSWITCH_SECURITY_KEY;
    this.accessToken = null;
    this.tokenExpiresAt = null;
  }

  /**
   * Generate SHA-512 signature for GamSwitch cashpower API
   */
  generateSignature({ type, nonce, timestamp, meterNumber }) {
    const payload = `${this.hashKey}cashpower${type}${nonce}${timestamp}${meterNumber}`;
    return crypto.createHash('sha512').update(payload).digest('hex');
  }

  /**
   * Generate SHA-512 signature for balance check
   */
  generateBalanceSignature({ nonce, timestamp }) {
    const payload = `${this.hashKey}balance${nonce}${timestamp}`;
    return crypto.createHash('sha512').update(payload).digest('hex');
  }

  /**
   * Get access token from GamSwitch API
   */
  async getAccessToken() {
    try {
      // Return cached token if available and not expired
      if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt) {
        return this.accessToken;
      }

      const data = new URLSearchParams({
        Username: this.username,
        Password: this.password,
        grant_type: 'password'
      });

      const response = await axios.post(`${this.baseURL}/token`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      // Cache for 19 years (API says 20 years but we'll refresh earlier)
      this.tokenExpiresAt = Date.now() + 19 * 365 * 24 * 60 * 60 * 1000;
      return this.accessToken;

    } catch (error) {
      throw new Error('Failed to obtain GamSwitch access token');
    }
  }

  /**
   * Check meter with GamSwitch
   */
  async checkMeter({ meterNumber, amount }) {
    try {
      const nonce = new Date().getTime().toString();
      const timestamp = Math.floor(Date.now() / 1000);

      const signature = this.generateSignature({
        type: 'check',
        nonce,
        timestamp,
        meterNumber
      });

      const token = await this.getAccessToken();

      const requestData = {
        Type: 'check',
        MeterNumber: meterNumber,
        Amount: amount.toString()
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Signature': signature,
        'nonce': nonce,
        'timestamp': timestamp
      };

      const response = await axios.post(
        `${this.baseURL}/api/cashpower/${this.interchange}`,
        requestData,
        { headers }
      );

      if (response.data.responseCode === '00') {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          data: response.data,
          error: response.data.responseDescription || 'Meter check failed'
        };
      }
    } catch (error) {
      console.error('GamSwitch meter check error:', error.response?.data || error.message);
      return {
        success: false,
        data: {
          responseDescription: error.response?.data?.responseDescription || 'Meter check failed',
          error: error.message
        }
      };
    }
  }

  /**
   * Vend cashpower through GamSwitch
   */
  async vendCashpower({ meterNumber, phone, amount }) {
    try {
      const nonce = new Date().getTime().toString();
      const timestamp = Math.floor(Date.now() / 1000);

      const signature = this.generateSignature({
        type: 'vend',
        nonce,
        timestamp,
        meterNumber
      });

      const token = await this.getAccessToken();

      const requestData = {
        Type: 'vend',
        MeterNumber: meterNumber,
        PhoneNumber: phone || '',
        Amount: amount.toString()
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Signature': signature,
        'nonce': nonce,
        'timestamp': timestamp
      };

      const response = await axios.post(
        `${this.baseURL}/api/cashpower/${this.interchange}`,
        requestData,
        { headers }
      );

      if (response.data.responseCode === '00') {
        return {
          success: true,
          data: {
            transactionId: response.data.transactionId || response.data.id,
            token: response.data.token,
            units: response.data.units,
            meterNumber: response.data.meterNumber,
            amount: response.data.amount,
            responseCode: response.data.responseCode,
            responseDescription: response.data.responseDescription
          }
        };
      } else {
        return {
          success: false,
          data: response.data,
          error: response.data.responseDescription || 'Cashpower vending failed'
        };
      }
    } catch (error) {
      console.error('GamSwitch cashpower vending error:', error.response?.data || error.message);
      return {
        success: false,
        data: {
          responseDescription: error.response?.data?.responseDescription || 'Cashpower vending failed',
          error: error.message
        }
      };
    }
  }

  /**
   * Reprint token through GamSwitch
   */
  async reprintToken({ meterNumber, phone }) {
    try {
      const nonce = new Date().getTime().toString();
      const timestamp = Math.floor(Date.now() / 1000);

      const signature = this.generateSignature({
        type: 'reprint',
        nonce,
        timestamp,
        meterNumber
      });

      const token = await this.getAccessToken();

      const requestData = {
        Type: 'reprint',
        MeterNumber: meterNumber,
        PhoneNumber: phone || ''
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Signature': signature,
        'nonce': nonce,
        'timestamp': timestamp
      };

      const response = await axios.post(
        `${this.baseURL}/api/cashpower/${this.interchange}`,
        requestData,
        { headers }
      );

      if (response.data.responseCode === '00') {
        return {
          success: true,
          data: {
            transactionId: response.data.transactionId || response.data.id,
            token: response.data.token,
            units: response.data.units,
            meterNumber: response.data.meterNumber,
            amount: response.data.amount,
            responseCode: response.data.responseCode,
            responseDescription: response.data.responseDescription
          }
        };
      } else {
        return {
          success: false,
          data: response.data,
          error: response.data.responseDescription || 'Token reprint failed'
        };
      }
    } catch (error) {
      console.error('GamSwitch token reprint error:', error.response?.data || error.message);
      return {
        success: false,
        data: {
          responseDescription: error.response?.data?.responseDescription || 'Token reprint failed',
          error: error.message
        }
      };
    }
  }

  /**
   * Check GamSwitch account balance
   */
  async checkBalance() {
    try {
      const nonce = new Date().getTime().toString();
      const timestamp = Math.floor(Date.now() / 1000);

      const signature = this.generateBalanceSignature({
        nonce,
        timestamp
      });

      const token = await this.getAccessToken();

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Signature': signature,
        'nonce': nonce,
        'timestamp': timestamp
      };

      const response = await axios.get(
        `${this.baseURL}/api/balance/${this.interchange}`,
        { headers }
      );

      if (response.data.responseCode === '00') {
        return {
          success: true,
          data: response.data,
          balance: parseFloat(response.data.Balance || response.data.balance || 0),
          currency: response.data.Currency || response.data.currency || 'DAL',
          nonce,
          timestamp,
          signature
        };
      } else {
        return {
          success: false,
          data: response.data
        };
      }
    } catch (error) {
      console.error('GamSwitch balance check error:', error.response?.data || error.message);
      return {
        success: false,
        data: {
          responseDescription: error.response?.data?.responseDescription || 'Balance check failed',
          error: error.message
        }
      };
    }
  }

  /**
   * Convert amount to minor units (e.g., 100.00 -> 10000)
   */
  convertToMinorUnits(amount) {
    return Math.round(parseFloat(amount) * 100);
  }

  /**
   * Convert amount from minor units (e.g., 10000 -> 100.00)
   */
  convertFromMinorUnits(amount) {
    return parseFloat(amount) / 100;
  }
}

export default new CashpowerGamSwitchService(); 