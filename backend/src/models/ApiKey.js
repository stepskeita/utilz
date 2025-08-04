import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import crypto from 'crypto';

class ApiKey extends Model {
  static generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  static generateSecretKey() {
    return crypto.randomBytes(24).toString('base64');
  }
}

ApiKey.init({
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
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  secretKey: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastUsedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isAirtime: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Access to airtime services'
  },
  isCashpower: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Access to electricity token services'
  },
  isBoth: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Access to both airtime and electricity services'
  },
  ipRestrictions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'List of IPs or IP ranges allowed to use this key'
  }
}, {
  sequelize,
  modelName: 'ApiKey',
  tableName: 'apiKeys',
  timestamps: true,
  indexes: [
    { fields: ['key'] },
    { fields: ['clientId'] },
    { fields: ['isActive'] }
  ]
});


// ApiKey.sync(
//   {
//     alter: true,
//   }
// )
//   .then(() => {
//     console.log('ApiKey table created successfully');
//   })
//   .catch((error) => {
//     console.error('Error creating ApiKey table:', error);
//   });

export default ApiKey;