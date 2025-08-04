import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class ApiUsage extends Model { }

ApiUsage.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  apiKeyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'apiKeys',
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
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  statusCode: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  responseTime: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Response time in milliseconds'
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  requestPayload: {
    type: DataTypes.JSON,
    allowNull: true
  },
  responsePayload: {
    type: DataTypes.JSON,
    allowNull: true
  },
  transactionAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Amount involved in the transaction if applicable'
  }
}, {
  sequelize,
  modelName: 'ApiUsage',
  tableName: 'apiUsages',
  timestamps: true,
  indexes: [
    { fields: ['apiKeyId'] },
    { fields: ['clientId'] },
    { fields: ['createdAt'] },
    { fields: ['endpoint'] }
  ]
});


// ApiUsage.sync(
//   {
//     alter: true,
//   }
// )
//   .then(() => {
//     console.log('ApiUsage table created successfully');
//   })
//   .catch((error) => {
//     console.error('Error creating ApiUsage table:', error);
//   });

export default ApiUsage;