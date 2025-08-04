/**
 * Migration: Migrate TopUpRequest data to UtilityTransaction
 * 
 * This migration transfers all existing topUpRequests data to the new utilityTransactions table
 * with type set to 'airtime' for all existing records.
 * 
 * The migration preserves all data relationships and maintains referential integrity.
 */

export const up = async (queryInterface, Sequelize) => {
  try {
    console.log('Starting TopUpRequest data migration...');

    // Check if topUpRequests table exists and has data
    const topUpRequestsCount = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM topUpRequests',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (topUpRequestsCount[0].count === 0) {
      console.log('No TopUpRequest data to migrate');
      return;
    }

    console.log(`Found ${topUpRequestsCount[0].count} TopUpRequest records to migrate`);

    // Migrate all TopUpRequest data to UtilityTransaction
    await queryInterface.sequelize.query(`
      INSERT INTO utilityTransactions (
        id,
        clientId,
        apiKeyId,
        type,
        networkCode,
        phoneNumber,
        amount,
        transactionReference,
        providerReference,
        status,
        errorMessage,
        completedAt,
        metaData,
        createdAt,
        updatedAt
      )
      SELECT 
        id,
        clientId,
        apiKeyId,
        'airtime' as type,
        networkCode,
        phoneNumber,
        amount,
        transactionReference,
        providerReference,
        status,
        errorMessage,
        completedAt,
        metaData,
        createdAt,
        updatedAt
      FROM topUpRequests
    `);

    console.log('TopUpRequest data migration completed successfully');

    // Verify migration
    const migratedCount = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM utilityTransactions WHERE type = "airtime"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    console.log(`Verified ${migratedCount[0].count} records migrated to utilityTransactions`);

  } catch (error) {
    console.error('Error in TopUpRequest data migration:', error);
    throw error;
  }
};

export const down = async (queryInterface, Sequelize) => {
  try {
    console.log('Rolling back TopUpRequest data migration...');

    // Remove migrated data from utilityTransactions
    await queryInterface.sequelize.query(`
      DELETE FROM utilityTransactions 
      WHERE type = 'airtime' 
      AND id IN (
        SELECT id FROM topUpRequests
      )
    `);

    console.log('TopUpRequest data migration rolled back successfully');
  } catch (error) {
    console.error('Error rolling back TopUpRequest data migration:', error);
    throw error;
  }
}; 