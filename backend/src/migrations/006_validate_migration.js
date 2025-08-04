/**
 * Migration: Validate migration integrity
 * 
 * This migration validates that all data has been migrated correctly and
 * maintains referential integrity across the database.
 */

export const up = async (queryInterface, Sequelize) => {
  try {
    console.log('Starting migration validation...');

    // 1. Validate API Key permissions
    const apiKeysValidation = await queryInterface.sequelize.query(`
      SELECT 
        COUNT(*) as total_keys,
        SUM(CASE WHEN isAirtime IS NOT NULL THEN 1 ELSE 0 END) as airtime_configured,
        SUM(CASE WHEN isCashpower IS NOT NULL THEN 1 ELSE 0 END) as cashpower_configured,
        SUM(CASE WHEN isBoth IS NOT NULL THEN 1 ELSE 0 END) as both_configured
      FROM apiKeys
    `, { type: Sequelize.QueryTypes.SELECT });

    const apiKeysResult = apiKeysValidation[0];
    console.log('API Keys Validation:');
    console.log(`- Total API Keys: ${apiKeysResult.total_keys}`);
    console.log(`- Airtime Configured: ${apiKeysResult.airtime_configured}`);
    console.log(`- Cashpower Configured: ${apiKeysResult.cashpower_configured}`);
    console.log(`- Both Configured: ${apiKeysResult.both_configured}`);

    if (apiKeysResult.total_keys !== apiKeysResult.airtime_configured) {
      throw new Error('Not all API keys have airtime permissions configured');
    }

    // 2. Validate UtilityTransaction data
    const utilityTransactionsValidation = await queryInterface.sequelize.query(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN type = 'airtime' THEN 1 ELSE 0 END) as airtime_transactions,
        SUM(CASE WHEN type = 'cashpower' THEN 1 ELSE 0 END) as cashpower_transactions,
        SUM(CASE WHEN clientId IS NOT NULL THEN 1 ELSE 0 END) as valid_client_references,
        SUM(CASE WHEN apiKeyId IS NOT NULL THEN 1 ELSE 0 END) as valid_api_key_references
      FROM utilityTransactions
    `, { type: Sequelize.QueryTypes.SELECT });

    const transactionsResult = utilityTransactionsValidation[0];
    console.log('UtilityTransactions Validation:');
    console.log(`- Total Transactions: ${transactionsResult.total_transactions}`);
    console.log(`- Airtime Transactions: ${transactionsResult.airtime_transactions}`);
    console.log(`- Cashpower Transactions: ${transactionsResult.cashpower_transactions}`);
    console.log(`- Valid Client References: ${transactionsResult.valid_client_references}`);
    console.log(`- Valid API Key References: ${transactionsResult.valid_api_key_references}`);

    if (transactionsResult.total_transactions !== transactionsResult.valid_client_references) {
      throw new Error('Some utility transactions have invalid client references');
    }

    if (transactionsResult.total_transactions !== transactionsResult.valid_api_key_references) {
      throw new Error('Some utility transactions have invalid API key references');
    }

    // 3. Validate WalletTransaction references
    const walletTransactionsValidation = await queryInterface.sequelize.query(`
      SELECT 
        COUNT(*) as total_wallet_transactions,
        SUM(CASE WHEN utilityTransactionId IS NOT NULL THEN 1 ELSE 0 END) as valid_utility_references
      FROM walletTransactions
    `, { type: Sequelize.QueryTypes.SELECT });

    const walletResult = walletTransactionsValidation[0];
    console.log('WalletTransactions Validation:');
    console.log(`- Total Wallet Transactions: ${walletResult.total_wallet_transactions}`);
    console.log(`- Valid Utility References: ${walletResult.valid_utility_references}`);

    // 4. Check for orphaned records
    const orphanedUtilityTransactions = await queryInterface.sequelize.query(`
      SELECT COUNT(*) as count
      FROM utilityTransactions ut
      LEFT JOIN clients c ON ut.clientId = c.id
      WHERE c.id IS NULL
    `, { type: Sequelize.QueryTypes.SELECT });

    if (orphanedUtilityTransactions[0].count > 0) {
      throw new Error(`Found ${orphanedUtilityTransactions[0].count} utility transactions with orphaned client references`);
    }

    const orphanedApiKeyReferences = await queryInterface.sequelize.query(`
      SELECT COUNT(*) as count
      FROM utilityTransactions ut
      LEFT JOIN apiKeys ak ON ut.apiKeyId = ak.id
      WHERE ak.id IS NULL
    `, { type: Sequelize.QueryTypes.SELECT });

    if (orphanedApiKeyReferences[0].count > 0) {
      throw new Error(`Found ${orphanedApiKeyReferences[0].count} utility transactions with orphaned API key references`);
    }

    // 5. Validate indexes
    const indexesValidation = await queryInterface.sequelize.query(`
      SELECT 
        COUNT(*) as total_indexes
      FROM information_schema.statistics 
      WHERE table_schema = DATABASE() 
      AND table_name IN ('utilityTransactions', 'apiKeys', 'walletTransactions')
    `, { type: Sequelize.QueryTypes.SELECT });

    console.log(`Total indexes on migrated tables: ${indexesValidation[0].total_indexes}`);

    console.log('Migration validation completed successfully');
    console.log('✅ All data integrity checks passed');

  } catch (error) {
    console.error('❌ Migration validation failed:', error.message);
    throw error;
  }
};

export const down = async (queryInterface, Sequelize) => {
  try {
    console.log('Rolling back migration validation...');
    // This migration is read-only, so rollback is a no-op
    console.log('Migration validation rollback completed (no changes made)');
  } catch (error) {
    console.error('Error rolling back migration validation:', error);
    throw error;
  }
}; 