/**
 * Migration Runner for iUtility Database Migrations
 * 
 * This script runs all migrations in the correct order to set up the iUtility database.
 * It includes safety checks, rollback capabilities, and comprehensive logging.
 */

import { sequelize } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import all migrations
import { up as enhanceApiKeys, down as enhanceApiKeysDown } from './001_enhance_api_keys.js';
import { up as createUtilityTransactions, down as createUtilityTransactionsDown } from './002_create_utility_transactions.js';
import { up as migrateTopUpData, down as migrateTopUpDataDown } from './003_migrate_topup_data.js';
import { up as setApiKeyPermissions, down as setApiKeyPermissionsDown } from './004_set_default_api_key_permissions.js';
import { up as updateWalletTransactions, down as updateWalletTransactionsDown } from './005_update_wallet_transactions.js';
import { up as validateMigration, down as validateMigrationDown } from './006_validate_migration.js';

const migrations = [
  {
    name: '001_enhance_api_keys',
    up: enhanceApiKeys,
    down: enhanceApiKeysDown
  },
  {
    name: '002_create_utility_transactions',
    up: createUtilityTransactions,
    down: createUtilityTransactionsDown
  },
  {
    name: '003_migrate_topup_data',
    up: migrateTopUpData,
    down: migrateTopUpDataDown
  },
  {
    name: '004_set_default_api_key_permissions',
    up: setApiKeyPermissions,
    down: setApiKeyPermissionsDown
  },
  {
    name: '005_update_wallet_transactions',
    up: updateWalletTransactions,
    down: updateWalletTransactionsDown
  },
  {
    name: '006_validate_migration',
    up: validateMigration,
    down: validateMigrationDown
  }
];

// Create migrations table if it doesn't exist
const createMigrationsTable = async () => {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Migrations table ready');
  } catch (error) {
    console.error('❌ Error creating migrations table:', error);
    throw error;
  }
};

// Check if migration has been executed
const isMigrationExecuted = async (migrationName) => {
  try {
    const [results] = await sequelize.query(
      'SELECT COUNT(*) as count FROM migrations WHERE name = ?',
      {
        replacements: [migrationName],
        type: sequelize.QueryTypes.SELECT
      }
    );
    return results.count > 0;
  } catch (error) {
    return false;
  }
};

// Mark migration as executed
const markMigrationExecuted = async (migrationName) => {
  try {
    await sequelize.query(
      'INSERT INTO migrations (name) VALUES (?)',
      {
        replacements: [migrationName]
      }
    );
  } catch (error) {
    console.error(`❌ Error marking migration ${migrationName} as executed:`, error);
    throw error;
  }
};

// Remove migration from executed list
const unmarkMigrationExecuted = async (migrationName) => {
  try {
    await sequelize.query(
      'DELETE FROM migrations WHERE name = ?',
      {
        replacements: [migrationName]
      }
    );
  } catch (error) {
    console.error(`❌ Error unmarking migration ${migrationName}:`, error);
    throw error;
  }
};

// Run migrations
const runMigrations = async (direction = 'up') => {
  try {
    console.log(`🚀 Starting ${direction} migrations...`);

    await createMigrationsTable();

    if (direction === 'up') {
      for (const migration of migrations) {
        const isExecuted = await isMigrationExecuted(migration.name);

        if (!isExecuted) {
          console.log(`\n📦 Running migration: ${migration.name}`);
          await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
          await markMigrationExecuted(migration.name);
          console.log(`✅ Migration ${migration.name} completed`);
        } else {
          console.log(`⏭️  Migration ${migration.name} already executed, skipping`);
        }
      }
    } else {
      // Run migrations in reverse order for rollback
      for (let i = migrations.length - 1; i >= 0; i--) {
        const migration = migrations[i];
        const isExecuted = await isMigrationExecuted(migration.name);

        if (isExecuted) {
          console.log(`\n🔄 Rolling back migration: ${migration.name}`);
          await migration.down(sequelize.getQueryInterface(), sequelize.Sequelize);
          await unmarkMigrationExecuted(migration.name);
          console.log(`✅ Migration ${migration.name} rolled back`);
        } else {
          console.log(`⏭️  Migration ${migration.name} not executed, skipping rollback`);
        }
      }
    }

    console.log(`\n🎉 All migrations ${direction === 'up' ? 'completed' : 'rolled back'} successfully!`);
  } catch (error) {
    console.error(`❌ Migration ${direction} failed:`, error);
    throw error;
  }
};

// Show migration status
const showStatus = async () => {
  try {
    await createMigrationsTable();

    console.log('\n📊 Migration Status:');
    console.log('==================');

    for (const migration of migrations) {
      const isExecuted = await isMigrationExecuted(migration.name);
      const status = isExecuted ? '✅ Executed' : '⏳ Pending';
      console.log(`${migration.name}: ${status}`);
    }
  } catch (error) {
    console.error('❌ Error showing migration status:', error);
  }
};

// Main execution
const main = async () => {
  const command = process.argv[2] || 'up';

  try {
    switch (command) {
      case 'up':
        await runMigrations('up');
        break;
      case 'down':
        await runMigrations('down');
        break;
      case 'status':
        await showStatus();
        break;
      default:
        console.log('Usage: node migrate.js [up|down|status]');
        console.log('  up     - Run all pending migrations');
        console.log('  down   - Rollback all migrations');
        console.log('  status - Show migration status');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runMigrations, showStatus }; 