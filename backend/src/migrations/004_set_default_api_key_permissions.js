/**
 * Migration: Set default API key permissions for existing clients
 * 
 * This migration sets default service permissions for existing API keys:
 * - Sets isAirtime = true for all existing API keys (since they were used for airtime)
 * - Sets isCashpower = false for all existing API keys
 * - Sets isBoth = false for all existing API keys
 * 
 * This ensures backward compatibility while enabling the new service-specific permissions.
 */

export const up = async (queryInterface, Sequelize) => {
  try {
    console.log('Starting API key permissions migration...');

    // Update all existing API keys to have airtime access by default
    const updatedRows = await queryInterface.sequelize.query(`
      UPDATE apiKeys 
      SET 
        isAirtime = true,
        isCashpower = false,
        isBoth = false
      WHERE isAirtime IS NULL OR isCashpower IS NULL OR isBoth IS NULL
    `);

    console.log(`Updated ${updatedRows[0].affectedRows} API key records with default permissions`);

    // Verify the migration
    const apiKeysCount = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM apiKeys WHERE isAirtime = true',
      { type: Sequelize.QueryTypes.SELECT }
    );

    console.log(`Verified ${apiKeysCount[0].count} API keys have airtime access`);

    // Log summary of permissions
    const permissionsSummary = await queryInterface.sequelize.query(`
      SELECT 
        COUNT(*) as total_keys,
        SUM(CASE WHEN isAirtime = true THEN 1 ELSE 0 END) as airtime_keys,
        SUM(CASE WHEN isCashpower = true THEN 1 ELSE 0 END) as cashpower_keys,
        SUM(CASE WHEN isBoth = true THEN 1 ELSE 0 END) as both_keys
      FROM apiKeys
    `, { type: Sequelize.QueryTypes.SELECT });

    const summary = permissionsSummary[0];
    console.log('API Key Permissions Summary:');
    console.log(`- Total API Keys: ${summary.total_keys}`);
    console.log(`- Airtime Access: ${summary.airtime_keys}`);
    console.log(`- Electricity Access: ${summary.cashpower_keys}`);
    console.log(`- Both Services: ${summary.both_keys}`);

  } catch (error) {
    console.error('Error in API key permissions migration:', error);
    throw error;
  }
};

export const down = async (queryInterface, Sequelize) => {
  try {
    console.log('Rolling back API key permissions migration...');

    // Reset all API key permissions to NULL (if possible) or false
    await queryInterface.sequelize.query(`
      UPDATE apiKeys 
      SET 
        isAirtime = false,
        isCashpower = false,
        isBoth = false
    `);

    console.log('API key permissions migration rolled back successfully');
  } catch (error) {
    console.error('Error rolling back API key permissions migration:', error);
    throw error;
  }
}; 