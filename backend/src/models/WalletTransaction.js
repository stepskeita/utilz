import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class WalletTransaction extends Model { }

WalletTransaction.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  walletId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'clientWallets',
      key: 'id'
    }
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'clients',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('debit', 'credit', 'refund', 'adjustment'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  balanceBefore: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  balanceAfter: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  utilityTransactionId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'utilityTransactions',
      key: 'id'
    }
  },
  clientTopUpRequestId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'clientTopUpRequests',
      key: 'id'
    }
  },

  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'WalletTransaction',
  tableName: 'walletTransactions',
  timestamps: true,
  indexes: [
    { fields: ['walletId'] },
    { fields: ['clientId'] },
    { fields: ['type'] },
    { fields: ['utilityTransactionId'] },
    { fields: ['clientTopUpRequestId'] },
    { fields: ['createdAt'] }
  ]
});

// WalletTransaction.sync({ alter: true })
//   .then(() => {
//     console.log('WalletTransaction table synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing WalletTransaction table:', error);
//   });

export default WalletTransaction;