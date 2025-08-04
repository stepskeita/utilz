/**
 * Migration: Enhance ApiKey table with service subscription fields
 * 
 * This migration adds the following fields to the apiKeys table:
 * - isAirtime: Boolean field to indicate airtime service access
 * - isCashpower: Boolean field to indicate electricity service access  
 * - isBoth: Boolean field to indicate access to both services
 * 
 * These fields enable service-specific API key permissions for the iUtility platform.
 */

export const up = async (queryInterface, Sequelize) => {
  try {
    console.log('Starting ApiKey enhancement migration...');

    // Add new columns to apiKeys table
    await queryInterface.addColumn('apiKeys', 'isAirtime', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indicates if this API key has access to airtime services'
    });

    await queryInterface.addColumn('apiKeys', 'isCashpower', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indicates if this API key has access to electricity services'
    });

    await queryInterface.addColumn('apiKeys', 'isBoth', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indicates if this API key has access to both airtime and electricity services'
    });

    // Add indexes for performance
    await queryInterface.addIndex('apiKeys', ['isAirtime'], {
      name: 'idx_api_keys_is_airtime'
    });

    await queryInterface.addIndex('apiKeys', ['isCashpower'], {
      name: 'idx_api_keys_is_cashpower'
    });

    await queryInterface.addIndex('apiKeys', ['isBoth'], {
      name: 'idx_api_keys_is_both'
    });

    // Create composite index for service filtering
    await queryInterface.addIndex('apiKeys', ['isAirtime', 'isCashpower', 'isBoth'], {
      name: 'idx_api_keys_service_permissions'
    });

    console.log('ApiKey enhancement migration completed successfully');
  } catch (error) {
    console.error('Error in ApiKey enhancement migration:', error);
    throw error;
  }
};

export const down = async (queryInterface, Sequelize) => {
  try {
    console.log('Rolling back ApiKey enhancement migration...');

    // Remove indexes
    await queryInterface.removeIndex('apiKeys', 'idx_api_keys_service_permissions');
    await queryInterface.removeIndex('apiKeys', 'idx_api_keys_is_both');
    await queryInterface.removeIndex('apiKeys', 'idx_api_keys_is_cashpower');
    await queryInterface.removeIndex('apiKeys', 'idx_api_keys_is_airtime');

    // Remove columns
    await queryInterface.removeColumn('apiKeys', 'isBoth');
    await queryInterface.removeColumn('apiKeys', 'isCashpower');
    await queryInterface.removeColumn('apiKeys', 'isAirtime');

    console.log('ApiKey enhancement migration rolled back successfully');
  } catch (error) {
    console.error('Error rolling back ApiKey enhancement migration:', error);
    throw error;
  }
}; 