/**
 * Migration: Create UtilityTransaction table
 * 
 * This migration creates the utilityTransactions table which replaces topUpRequests
 * and supports both airtime and electricity token transactions.
 * 
 * The table includes all fields from TopUpRequest plus:
 * - type: ENUM field to distinguish between 'airtime' and 'cashpower' transactions
 * - meterNumber: For electricity token transactions
 */

export const up = async (queryInterface, Sequelize) => {
  try {
    console.log('Starting UtilityTransaction table creation...');

    await queryInterface.createTable('utilityTransactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      clientId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      apiKeyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'apiKeys',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('airtime', 'cashpower'),
        allowNull: false,
        comment: 'Type of utility transaction'
      },
      networkCode: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Provider code (e.g., africell, qcell, comium, gamcel, gamswitch, nawec)'
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Phone number for airtime transactions'
      },
      meterNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Meter number for electricity token transactions'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transactionReference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      providerReference: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Reference ID from the network provider'
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'fail'),
        allowNull: false,
        defaultValue: 'pending'
      },
      errorMessage: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      metaData: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Additional data about the transaction'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes for performance
    await queryInterface.addIndex('utilityTransactions', ['clientId'], {
      name: 'idx_utility_transactions_client_id'
    });

    await queryInterface.addIndex('utilityTransactions', ['apiKeyId'], {
      name: 'idx_utility_transactions_api_key_id'
    });

    await queryInterface.addIndex('utilityTransactions', ['type'], {
      name: 'idx_utility_transactions_type'
    });

    await queryInterface.addIndex('utilityTransactions', ['status'], {
      name: 'idx_utility_transactions_status'
    });

    await queryInterface.addIndex('utilityTransactions', ['transactionReference'], {
      name: 'idx_utility_transactions_reference'
    });

    await queryInterface.addIndex('utilityTransactions', ['networkCode'], {
      name: 'idx_utility_transactions_network'
    });

    await queryInterface.addIndex('utilityTransactions', ['createdAt'], {
      name: 'idx_utility_transactions_created_at'
    });

    // Composite indexes for common queries
    await queryInterface.addIndex('utilityTransactions', ['clientId', 'type'], {
      name: 'idx_utility_transactions_client_type'
    });

    await queryInterface.addIndex('utilityTransactions', ['type', 'status'], {
      name: 'idx_utility_transactions_type_status'
    });

    await queryInterface.addIndex('utilityTransactions', ['clientId', 'createdAt'], {
      name: 'idx_utility_transactions_client_created'
    });

    console.log('UtilityTransaction table created successfully');
  } catch (error) {
    console.error('Error creating UtilityTransaction table:', error);
    throw error;
  }
};

export const down = async (queryInterface, Sequelize) => {
  try {
    console.log('Rolling back UtilityTransaction table creation...');

    // Remove indexes
    await queryInterface.removeIndex('utilityTransactions', 'idx_utility_transactions_client_created');
    await queryInterface.removeIndex('utilityTransactions', 'idx_utility_transactions_type_status');
    await queryInterface.removeIndex('utilityTransactions', 'idx_utility_transactions_client_type');
    await queryInterface.removeIndex('utilityTransactions', 'idx_utility_transactions_created_at');
    await queryInterface.removeIndex('utilityTransactions', 'idx_utility_transactions_network');
    await queryInterface.removeIndex('utilityTransactions', 'idx_utility_transactions_reference');
    await queryInterface.removeIndex('utilityTransactions', 'idx_utility_transactions_status');
    await queryInterface.removeIndex('utilityTransactions', 'idx_utility_transactions_type');
    await queryInterface.removeIndex('utilityTransactions', 'idx_utility_transactions_api_key_id');
    await queryInterface.removeIndex('utilityTransactions', 'idx_utility_transactions_client_id');

    // Drop the table
    await queryInterface.dropTable('utilityTransactions');

    console.log('UtilityTransaction table dropped successfully');
  } catch (error) {
    console.error('Error rolling back UtilityTransaction table creation:', error);
    throw error;
  }
}; 