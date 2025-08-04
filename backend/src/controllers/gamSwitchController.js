import gamSwitchService from '../services/gamSwitchService.js';

class GamSwitchController {
  /**
   * Check GamSwitch merchant balance
   */
  async checkBalance(req, res, next) {
    try {
      const result = await gamSwitchService.checkBalance();

      res.status(200).json({
        success: true,
        message: 'Balance retrieved successfully',
        data: {
          balance: result.data?.balance,
          currency: result.currency,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new GamSwitchController();

export const {
  checkBalance
} = controller;

export default controller;
