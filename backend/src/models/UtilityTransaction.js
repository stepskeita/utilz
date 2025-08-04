import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class UtilityTransaction extends Model { }

UtilityTransaction.init({
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
  apiKeyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'apiKeys',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('airtime', 'cashpower'),
    allowNull: false,
    comment: 'Type of utility transaction'
  },
  networkCode: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Provider code (e.g., africell, qcell, comium, gamcel for airtime; nawec, gamswitch for cashpower)'
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Phone number for airtime transactions'
  },
  meterNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Meter number for cashpower transactions'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  transactionReference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  providerReference: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Reference ID from the network provider'
  },
  status: {
    type: DataTypes.ENUM('success', 'fail'),
    allowNull: false
  },
  errorMessage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metaData: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional data about the transaction (tokens, units, etc.)'
  }
}, {
  sequelize,
  modelName: 'UtilityTransaction',
  tableName: 'utilityTransactions',
  timestamps: true,
  indexes: [
    { fields: ['clientId'] },
    { fields: ['transactionReference'] },
    { fields: ['status'] },
    { fields: ['networkCode'] },
    { fields: ['type'] }
  ]
});

// Uncomment this temporarily to sync the model with database
// UtilityTransaction.sync({
//   alter: true,
//   logging: console.log,
// }).then(() => {
//   console.log('UtilityTransaction table created or updated');
// }).catch((error) => {
//   console.error('Error creating UtilityTransaction table:', error);
// });

export default UtilityTransaction; 