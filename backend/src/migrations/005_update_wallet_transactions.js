/**
 * Migration: Update WalletTransaction table to reference UtilityTransaction
 * 
 * This migration updates the walletTransactions table to reference utilityTransactions
 * instead of topUpRequests, maintaining the relationship between wallet transactions
 * and utility transactions.
 */

export const up = async (queryInterface, Sequelize) => {
  try {
    console.log('Starting WalletTransaction reference update...');

    // First, check if the topUpRequestId column exists
    const tableDescription = await queryInterface.describeTable('walletTransactions');

    if (tableDescription.topUpRequestId) {
      // Add the new utilityTransactionId column
      await queryInterface.addColumn('walletTransactions', 'utilityTransactionId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'utilityTransactions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });

      // Copy the references from topUpRequestId to utilityTransactionId
      await queryInterface.sequelize.query(`
        UPDATE walletTransactions 
        SET utilityTransactionId = topUpRequestId 
        WHERE topUpRequestId IS NOT NULL
      `);

      console.log('Copied references from topUpRequestId to utilityTransactionId');

      // Add index for the new column
      await queryInterface.addIndex('walletTransactions', ['utilityTransactionId'], {
        name: 'idx_wallet_transactions_utility_transaction_id'
      });

      // Remove the old column (after ensuring data is migrated)
      await queryInterface.removeColumn('walletTransactions', 'topUpRequestId');

      console.log('Removed old topUpRequestId column');
    } else {
      // If topUpRequestId doesn't exist, just add the new column
      await queryInterface.addColumn('walletTransactions', 'utilityTransactionId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'utilityTransactions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });

      await queryInterface.addIndex('walletTransactions', ['utilityTransactionId'], {
        name: 'idx_wallet_transactions_utility_transaction_id'
      });
    }

    console.log('WalletTransaction reference update completed successfully');

  } catch (error) {
    console.error('Error in WalletTransaction reference update:', error);
    throw error;
  }
};

export const down = async (queryInterface, Sequelize) => {
  try {
    console.log('Rolling back WalletTransaction reference update...');

    // Add back the topUpRequestId column
    await queryInterface.addColumn('walletTransactions', 'topUpRequestId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'topUpRequests',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Copy references back from utilityTransactionId to topUpRequestId
    await queryInterface.sequelize.query(`
      UPDATE walletTransactions 
      SET topUpRequestId = utilityTransactionId 
      WHERE utilityTransactionId IS NOT NULL
    `);

    // Remove the new column
    await queryInterface.removeIndex('walletTransactions', 'idx_wallet_transactions_utility_transaction_id');
    await queryInterface.removeColumn('walletTransactions', 'utilityTransactionId');

    console.log('WalletTransaction reference update rolled back successfully');
  } catch (error) {
    console.error('Error rolling back WalletTransaction reference update:', error);
    throw error;
  }
}; 