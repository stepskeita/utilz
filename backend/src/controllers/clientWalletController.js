import clientWalletService from '../services/clientWalletService.js';
import { ClientTopUpRequest } from '../models/index.js';
import createError from 'http-errors';

class ClientWalletController {

  /**
   * Get client wallet balance
   */
  async getWalletBalance(req, res, next) {
    try {
      const clientId = req.client.id;

      const wallet = await clientWalletService.getWalletBalance(clientId);

      res.status(200).json({
        success: true,
        data: wallet
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get client wallet transactions
   */
  async getWalletTransactions(req, res, next) {
    try {
      const clientId = req.client.id;
      const { page, limit, type, startDate, endDate, amount } = req.query;

      const options = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 50,
        type,
        amount,
        startDate,
        endDate
      };

      const transactions = await clientWalletService.getWalletTransactions(clientId, options);

      res.status(200).json({
        success: true,
        data: transactions
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create top-up request with receipt upload
   */
  async createTopUpRequest(req, res, next) {
    try {
      const clientId = req.client.id;
      const requestData = req.body;
      const file = req.files ? req.files.receipt : null;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'Receipt file is required'
        });
      }

      const result = await clientWalletService.createTopUpRequest(clientId, requestData, file);

      res.status(201).json({
        success: true,
        message: 'Top-up request created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get client top-up requests
   */
  async getTopUpRequests(req, res, next) {
    try {
      const clientId = req.client.id;
      const { page, limit, status } = req.query;

      const options = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
        status
      };

      const requests = await clientWalletService.getTopUpRequests(clientId, options);

      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get specific top-up request details
   */
  async getTopUpRequest(req, res, next) {
    try {
      const { id } = req.params;
      const clientId = req.client.id;

      console.log("Fetching top-up request details for ID:", id);

      const request = await clientWalletService.getTopUpRequest(id, clientId);

      res.status(200).json({
        success: true,
        data: request
      });
    } catch (error) {
      next(error);
    }
  }


  /**
 * Delete a pending top-up request (client only)
 */
  async deleteTopUpRequest(req, res, next) {
    try {
      const { requestId } = req.params;
      const clientId = req.client.id;
      const result = await clientWalletService.deleteTopUpRequest(requestId, clientId);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin-only methods

  /**
   * Admin: Get all pending top-up requests
   */
  async getAllTopUpRequests(req, res, next) {
    try {
      const { page, limit, status, clientId } = req.query;

      const result = await clientWalletService.getAllTopUpRequests({
        page,
        limit,
        status,
        clientId
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }


  async getAdminTopUpRequest(req, res, next) {
    try {
      const { id } = req.params;

      const request = await clientWalletService.getTopUpRequest(id);

      res.status(200).json({
        success: true,
        data: request
      });
    } catch (error) {
      next(error);
    }
  }


  /**
   * Admin: Approve top-up request
   */
  async approveTopUpRequest(req, res, next) {
    try {
      const { id } = req.params;
      console.log("Approving top-up request:", id);
      const adminId = req.user.id;
      const approvalData = req.body;

      const result = await clientWalletService.approveTopUpRequest(id, adminId, approvalData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          approvedAmount: result.approvedAmount,
          newBalance: result.newBalance
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Reject top-up request
   */
  async rejectTopUpRequest(req, res, next) {
    try {
      const { id } = req.params;
      const adminId = req.user.id;
      const rejectionData = req.body;

      const result = await clientWalletService.rejectTopUpRequest(id, adminId, rejectionData);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Get receipt as base64 image
   */
  async downloadReceipt(req, res, next) {
    try {
      const { requestId } = req.params;

      const request = await ClientTopUpRequest.findByPk(requestId);

      if (!request) {
        throw createError(404, 'Top-up request not found');
      }

      if (!request.receiptFilePath || !request.receiptMimeType) {
        throw createError(404, 'Receipt file not found');
      }

      // Get receipt as base64
      const receiptBase64 = await clientWalletService.getReceiptAsBase64(
        request.receiptFilePath,
        request.receiptMimeType
      );

      res.status(200).json({
        success: true,
        data: {
          requestId: request.id,
          fileName: request.receiptFileName,
          mimeType: request.receiptMimeType,
          base64: receiptBase64
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new ClientWalletController();

export const {
  getWalletBalance,
  getWalletTransactions,
  createTopUpRequest,
  getTopUpRequests,
  getTopUpRequest,
  getAllTopUpRequests,
  approveTopUpRequest,
  rejectTopUpRequest,
  downloadReceipt
  , deleteTopUpRequest
} = controller;

export default controller;
