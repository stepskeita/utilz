import axios from 'axios';
import moment from 'moment';

class CashpowerNawecService {
  constructor() {
    this.nawecEnvs = {
      grant_type: process.env.NAWEC_GRANT_TYPE || '',
      username: process.env.NAWEC_USERNAME || '',
      password: process.env.NAWEC_PASSWORD || '',
      scope: process.env.NAWEC_SCOPE || '',
      url: process.env.NAWEC_URL || '',
      basic_token: process.env.NAWEC_BASIC_TOKEN || '',
      content_type: process.env.NAWEC_CONTENT_TYPE || '',
      origin: process.env.NAWEC_ORIGIN || '',
      env: process.env.NAWEC_ENV || '',
      api_version: process.env.NAWEC_API_VERSION || ''
    };
  }

  /**
   * Get NAWEC access token
   */
  async getToken() {
    try {
      const body = {
        grant_type: this.nawecEnvs.grant_type,
        username: this.nawecEnvs.username,
        password: this.nawecEnvs.password,
        scope: this.nawecEnvs.scope
      };

      const formBody = Object.keys(body)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key]))
        .join('&');

      const { data } = await axios.post(`${this.nawecEnvs.url}/token`, formBody, {
        headers: {
          'Content-Type': this.nawecEnvs.content_type,
          'Authorization': 'Basic ' + this.nawecEnvs.basic_token
        }
      });

      return data.access_token;
    } catch (error) {
      console.error('Error getting NAWEC token:', error);
      throw new Error('Failed to obtain NAWEC access token');
    }
  }

  /**
   * Format token with dashes
   */
  formatToken(token) {
    let powerToken = '';
    for (let i = 0; i < token.length; i++) {
      if (
        powerToken.length === 4 ||
        powerToken.length === 9 ||
        powerToken.length === 14 ||
        powerToken.length === 19
      ) {
        powerToken += '-' + token[i];
      } else {
        powerToken += token[i];
      }
    }
    return powerToken;
  }

  /**
   * Check meter with NAWEC
   */
  async checkMeter({ meterNumber, amount }) {
    try {
      if (amount < 50) {
        return {
          success: false,
          error: 'The minimum allowed amount is D50'
        };
      }

      // Get NAWEC token
      const token = await this.getToken();
      if (!token) {
        return {
          success: false,
          error: 'No token to make transaction'
        };
      }

      // Check meter
      const { data } = await axios.get(
        `${this.nawecEnvs.url}/t/${this.nawecEnvs.env}/venPayment/${this.nawecEnvs.api_version}/?meterSerial=${meterNumber}&totalPayment=${amount}`,
        {
          headers: {
            'Authorization': 'Bearer ' + token,
            'X-Incms-Origin-D': this.nawecEnvs.origin,
            'X-Incms-Tenant': this.nawecEnvs.env
          }
        }
      );

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('NAWEC meter check error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message || 'Meter check failed'
      };
    }
  }

  /**
   * Buy power from NAWEC
   */
  async buyPower({ meterNumber, phone, amount }) {
    try {
      if (amount < 50) {
        return {
          success: false,
          error: 'The minimum allowed amount is D50'
        };
      }

      // Get NAWEC token
      const token = await this.getToken();
      if (!token) {
        return {
          success: false,
          error: 'No token to make transaction'
        };
      }

      // Prepare request body
      const formBody = {
        account: '1001119447',
        units: 0,
        unitsType: 'KWP',
        debtPayment: 0,
        tariffDescription: 'Domestic Pre-payment Electricity',
        percentageDebt: 0,
        accountBalance: 0,
        unitsPayment: 0,
        comment: `iUtility - ${meterNumber} - ${moment(new Date(Date.now())).format('DD MMMM YYYY, HH:mm:ss')}`,
        meterSerial: meterNumber,
        totalPayment: amount,
        phoneNumber: phone || ''
      };

      const { data } = await axios.post(
        `${this.nawecEnvs.url}/t/${this.nawecEnvs.env}/venPayment/${this.nawecEnvs.api_version}/`,
        formBody,
        {
          headers: {
            'Authorization': 'Bearer ' + token,
            'X-Incms-Origin-D': this.nawecEnvs.username,
            'X-Incms-Tenant': this.nawecEnvs.env
          }
        }
      );

      if (data.responseCode === '00' || data.responseCode === '0') {
        return {
          success: true,
          data: {
            transactionId: data.transactionId || data.id,
            token: data.token ? this.formatToken(data.token) : null,
            units: data.units,
            meterNumber: data.meterSerial || meterNumber,
            amount: data.totalPayment || amount,
            responseCode: data.responseCode,
            responseDescription: data.responseDescription || 'Success'
          }
        };
      } else {
        return {
          success: false,
          data: data,
          error: data.responseDescription || 'Cashpower purchase failed'
        };
      }
    } catch (error) {
      console.error('NAWEC buy power error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message || 'Cashpower purchase failed'
      };
    }
  }

  /**
   * Get transaction details from NAWEC
   */
  async getTransaction(transactionId) {
    try {
      // Get NAWEC token
      const token = await this.getToken();
      if (!token) {
        return {
          success: false,
          error: 'No token to make transaction'
        };
      }

      const { data } = await axios.get(
        `${this.nawecEnvs.url}/t/${this.nawecEnvs.env}/venPayment/${this.nawecEnvs.api_version}/${transactionId}`,
        {
          headers: {
            'Authorization': 'Bearer ' + token,
            'X-Incms-Origin-D': this.nawecEnvs.username,
            'X-Incms-Tenant': this.nawecEnvs.env
          }
        }
      );

      if (data.responseCode === '00' || data.responseCode === '0') {
        return {
          success: true,
          data: {
            transactionId: data.transactionId || data.id,
            token: data.token ? this.formatToken(data.token) : null,
            units: data.units,
            meterNumber: data.meterSerial,
            amount: data.totalPayment,
            responseCode: data.responseCode,
            responseDescription: data.responseDescription || 'Success'
          }
        };
      } else {
        return {
          success: false,
          data: data,
          error: data.responseDescription || 'Transaction retrieval failed'
        };
      }
    } catch (error) {
      console.error('NAWEC get transaction error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message || 'Transaction retrieval failed'
      };
    }
  }

  /**
   * Check NAWEC account balance
   */
  async checkBalance() {
    try {
      // Get NAWEC token
      const token = await this.getToken();
      if (!token) {
        return {
          success: false,
          error: 'No token to check balance'
        };
      }

      const { data } = await axios.get(
        `${this.nawecEnvs.url}/t/${this.nawecEnvs.env}/account/${this.nawecEnvs.api_version}/balance`,
        {
          headers: {
            'Authorization': 'Bearer ' + token,
            'X-Incms-Origin-D': this.nawecEnvs.username,
            'X-Incms-Tenant': this.nawecEnvs.env
          }
        }
      );

      if (data.responseCode === '00' || data.responseCode === '0') {
        return {
          success: true,
          data: data,
          balance: parseFloat(data.balance || data.Balance || 0),
          currency: data.currency || data.Currency || 'DAL'
        };
      } else {
        return {
          success: false,
          data: data,
          error: data.responseDescription || 'Balance check failed'
        };
      }
    } catch (error) {
      console.error('NAWEC balance check error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message || 'Balance check failed'
      };
    }
  }
}

export default new CashpowerNawecService(); 