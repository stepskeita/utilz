import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class ClientBilling extends Model { }

ClientBilling.init({
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
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'NGN',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'pending'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  billingPeriodStart: {
    type: DataTypes.DATE,
    allowNull: false
  },
  billingPeriodEnd: {
    type: DataTypes.DATE,
    allowNull: false
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    unique: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ClientBilling',
  tableName: 'clientBillings',
  timestamps: true
});

// ClientBilling.sync({
//   alter: true,
// }).then(() => {
//   console.log('ClientBilling table created or updated');
// }).catch((error) => {
//   console.error('Error creating ClientBilling table:', error);
// });


export default ClientBilling;