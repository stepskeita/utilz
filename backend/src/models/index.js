import { sequelize, Op } from '../config/database.js';
import User from './User.js';
import Client from './Client.js';
import ApiKey from './ApiKey.js';
import ApiUsage from './ApiUsage.js';
import ClientBilling from './ClientBilling.js';
import UtilityTransaction from './UtilityTransaction.js';
import ClientWallet from './ClientWallet.js';
import WalletTransaction from './WalletTransaction.js';
import ClientTopUpRequest from './ClientTopUpRequest.js';
// ... other imports

// Define relationships
// Client relationships
Client.hasMany(ApiKey, { foreignKey: 'clientId', onDelete: 'CASCADE' });
ApiKey.belongsTo(Client, { foreignKey: 'clientId' });

Client.hasMany(ApiUsage, { foreignKey: 'clientId' });
ApiUsage.belongsTo(Client, { foreignKey: 'clientId' });

Client.hasMany(ClientBilling, { foreignKey: 'clientId', onDelete: 'CASCADE' });
ClientBilling.belongsTo(Client, { foreignKey: 'clientId' });

Client.hasMany(UtilityTransaction, { foreignKey: 'clientId' });
UtilityTransaction.belongsTo(Client, { foreignKey: 'clientId' });

// ApiKey relationships
ApiKey.hasMany(ApiUsage, { foreignKey: 'apiKeyId' });
ApiUsage.belongsTo(ApiKey, { foreignKey: 'apiKeyId' });

ApiKey.hasMany(UtilityTransaction, { foreignKey: 'apiKeyId' });
UtilityTransaction.belongsTo(ApiKey, { foreignKey: 'apiKeyId' });

// Client wallet relationships
Client.hasOne(ClientWallet, {
    foreignKey: 'clientId',
    as: 'wallet'
});
ClientWallet.belongsTo(Client, {
    foreignKey: 'clientId',
    as: 'client'
});

Client.hasMany(WalletTransaction, {
    foreignKey: 'clientId',
    as: 'transactions'
});
WalletTransaction.belongsTo(Client, {
    foreignKey: 'clientId',
    as: 'client'
});

ClientWallet.hasMany(WalletTransaction, {
    foreignKey: 'walletId',
    as: 'transactions'
});
WalletTransaction.belongsTo(ClientWallet, {
    foreignKey: 'walletId',
    as: 'wallet'
});

// Client Top-up Request relationships
Client.hasMany(ClientTopUpRequest, {
    foreignKey: 'clientId',
    as: 'topUpRequests'
});
ClientTopUpRequest.belongsTo(Client, {
    foreignKey: 'clientId',
    as: 'client'
});

// Admin (User) relationships for client top-up requests
User.hasMany(ClientTopUpRequest, {
    foreignKey: 'processedBy',
    as: 'processedTopUpRequests'
});
ClientTopUpRequest.belongsTo(User, {
    foreignKey: 'processedBy',
    as: 'processor'
});

// UtilityTransaction request transaction linking
UtilityTransaction.hasOne(WalletTransaction, {
    foreignKey: 'utilityTransactionId',
    as: 'walletTransaction'
});
WalletTransaction.belongsTo(UtilityTransaction, {
    foreignKey: 'utilityTransactionId',
    as: 'utilityTransaction'
});

// Client top-up request transaction linking
ClientTopUpRequest.hasOne(WalletTransaction, {
    foreignKey: 'clientTopUpRequestId',
    as: 'walletTransaction'
});
WalletTransaction.belongsTo(ClientTopUpRequest, {
    foreignKey: 'clientTopUpRequestId',
    as: 'clientTopUpRequest'
});

// Function to sync all models
const syncDatabase = async (options = {}) => {
    await sequelize.sync(options);
    console.log('Database synchronized');
};

export {
    sequelize,
    Op,
    User,
    Client,
    ApiKey,
    ApiUsage,
    ClientBilling,
    UtilityTransaction,
    ClientWallet,
    WalletTransaction,
    ClientTopUpRequest,
    syncDatabase
};