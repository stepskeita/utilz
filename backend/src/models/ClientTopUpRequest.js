import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class ClientTopUpRequest extends Model { }

ClientTopUpRequest.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'clients',
      key: 'id'
    }
  },
  requestedAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Amount requested by client'
  },
  approvedAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Amount approved by admin (can be different from requested)'
  },
  receiptFileName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Name of uploaded receipt file'
  },
  receiptFilePath: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Path to uploaded receipt file'
  },
  receiptFileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Size of uploaded file in bytes'
  },
  receiptMimeType: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'MIME type of uploaded file'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Payment method used (bank transfer, mobile money, etc.)'
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Payment reference number from client'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Admin notes about the request'
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Reason for rejection if status is rejected'
  },
  processedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'ID of admin user who processed the request'
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  clientNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Additional notes from client'
  }
}, {
  sequelize,
  modelName: 'ClientTopUpRequest',
  tableName: 'clientTopUpRequests',
  timestamps: true,
  indexes: [
    {
      fields: ['clientId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// ClientTopUpRequest.sync({
//   alter: true
// }).then(() => {
//   console.log('ClientTopUpRequest table created or updated');
// }).catch((error) => {
//   console.error('Error creating ClientTopUpRequest table:', error);
// });

export default ClientTopUpRequest;
