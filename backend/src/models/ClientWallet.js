import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class ClientWallet extends Model { }

ClientWallet.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'clients',
      key: 'id'
    }
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  lastTopupDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended', 'closed'),
    defaultValue: 'active'
  },
  lowBalanceThreshold: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 100.00
  },
  notificationEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  }
}, {
  sequelize,
  modelName: 'ClientWallet',
  tableName: 'clientWallets',
  timestamps: true,
  indexes: [
    { fields: ['clientId'] }
  ]
});



// ClientWallet.sync({ alter: true })
//   .then(() => {
//     console.log('ClientWallet table synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing ClientWallet table:', error);
//   });
export default ClientWallet;