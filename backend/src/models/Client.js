import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Client extends Model { }

Client.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Hashed password for client authentication'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  plan: {
    type: DataTypes.STRING,
    defaultValue: 'basic',
    comment: 'Subscription plan: basic, premium, enterprise'
  },
  monthlyQuota: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    comment: 'Monthly API call limit'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  webhookUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
}, {
  sequelize,
  modelName: 'Client',
  tableName: 'clients',
  timestamps: true
});


// Client.sync({
//   alter: true,
// })
//   .then(() => {
//     console.log('Client table created successfully');
//   })
//   .catch((error) => {
//     console.error('Error creating Client table:', error);
//   });

export default Client;