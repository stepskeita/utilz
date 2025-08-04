/**
 * Database Backup Script for iUtility Migrations
 * 
 * This script creates a backup of the database before running migrations
 * to ensure data safety and recovery capabilities.
 */

import { sequelize } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

// Get database configuration
const getDatabaseConfig = () => {
  const config = sequelize.config;
  return {
    host: config.host,
    port: config.port || 3306,
    user: config.username,
    password: config.password,
    database: config.database
  };
};

// Create backup directory
const createBackupDirectory = () => {
  const backupDir = path.join(__dirname, '../backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
};

// Generate backup filename with timestamp
const generateBackupFilename = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `iutility_backup_${timestamp}.sql`;
};

// Create MySQL backup
const createBackup = async () => {
  try {
    const config = getDatabaseConfig();
    const backupDir = createBackupDirectory();
    const backupFile = generateBackupFilename();
    const backupPath = path.join(backupDir, backupFile);

    console.log('🔄 Creating database backup...');
    console.log(`📁 Backup location: ${backupPath}`);

    // Create mysqldump command
    const dumpCommand = `mysqldump -h ${config.host} -P ${config.port} -u ${config.user} -p${config.password} ${config.database} > ${backupPath}`;

    // Execute backup
    await execAsync(dumpCommand);

    // Verify backup file exists and has content
    if (fs.existsSync(backupPath)) {
      const stats = fs.statSync(backupPath);
      if (stats.size > 0) {
        console.log(`✅ Backup created successfully: ${backupFile}`);
        console.log(`📊 Backup size: ${(stats.size / 1024).toFixed(2)} KB`);
        return backupPath;
      } else {
        throw new Error('Backup file is empty');
      }
    } else {
      throw new Error('Backup file was not created');
    }
  } catch (error) {
    console.error('❌ Backup creation failed:', error.message);
    throw error;
  }
};

// Restore from backup
const restoreBackup = async (backupPath) => {
  try {
    const config = getDatabaseConfig();

    console.log('🔄 Restoring database from backup...');
    console.log(`📁 Restoring from: ${backupPath}`);

    // Create mysql restore command
    const restoreCommand = `mysql -h ${config.host} -P ${config.port} -u ${config.user} -p${config.password} ${config.database} < ${backupPath}`;

    // Execute restore
    await execAsync(restoreCommand);

    console.log('✅ Database restored successfully');
  } catch (error) {
    console.error('❌ Database restore failed:', error.message);
    throw error;
  }
};

// List available backups
const listBackups = () => {
  try {
    const backupDir = createBackupDirectory();
    const files = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.sql'))
      .sort((a, b) => {
        const statsA = fs.statSync(path.join(backupDir, a));
        const statsB = fs.statSync(path.join(backupDir, b));
        return statsB.mtime.getTime() - statsA.mtime.getTime();
      });

    if (files.length === 0) {
      console.log('📁 No backup files found');
      return [];
    }

    console.log('\n📁 Available backups:');
    console.log('=====================');

    files.forEach((file, index) => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024).toFixed(2);
      const date = stats.mtime.toLocaleString();
      console.log(`${index + 1}. ${file} (${size} KB) - ${date}`);
    });

    return files.map(file => path.join(backupDir, file));
  } catch (error) {
    console.error('❌ Error listing backups:', error);
    return [];
  }
};

// Validate backup integrity
const validateBackup = async (backupPath) => {
  try {
    console.log('🔍 Validating backup integrity...');

    // Check if file exists and has content
    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup file does not exist');
    }

    const stats = fs.statSync(backupPath);
    if (stats.size === 0) {
      throw new Error('Backup file is empty');
    }

    // Read first few lines to check if it's a valid SQL dump
    const content = fs.readFileSync(backupPath, 'utf8').substring(0, 1000);

    if (!content.includes('-- MySQL dump') && !content.includes('-- MariaDB dump')) {
      throw new Error('Backup file does not appear to be a valid MySQL dump');
    }

    console.log('✅ Backup validation passed');
    return true;
  } catch (error) {
    console.error('❌ Backup validation failed:', error.message);
    return false;
  }
};

// Main backup function
const backupDatabase = async (action = 'create') => {
  try {
    switch (action) {
      case 'create':
        return await createBackup();

      case 'list':
        return listBackups();

      case 'validate':
        const backups = listBackups();
        if (backups.length > 0) {
          return await validateBackup(backups[0]);
        } else {
          console.log('❌ No backups found to validate');
          return false;
        }

      case 'restore':
        const availableBackups = listBackups();
        if (availableBackups.length > 0) {
          console.log('\n⚠️  WARNING: This will overwrite the current database!');
          console.log('Are you sure you want to continue? (y/N)');

          // In a real implementation, you'd want to prompt for confirmation
          // For now, we'll just show the warning
          console.log('Restore functionality requires interactive confirmation');
          return availableBackups[0];
        } else {
          console.log('❌ No backups found to restore');
          return null;
        }

      default:
        console.log('Usage: node backup.js [create|list|validate|restore]');
        console.log('  create  - Create a new backup');
        console.log('  list    - List available backups');
        console.log('  validate - Validate the latest backup');
        console.log('  restore - Restore from the latest backup');
    }
  } catch (error) {
    console.error('❌ Backup operation failed:', error);
    throw error;
  }
};

// Auto-backup before migrations
const autoBackup = async () => {
  try {
    console.log('🛡️  Creating automatic backup before migrations...');
    const backupPath = await createBackup();
    console.log('✅ Automatic backup completed');
    return backupPath;
  } catch (error) {
    console.error('❌ Automatic backup failed:', error);
    throw error;
  }
};

// Run if called directly
const main = async () => {
  const action = process.argv[2] || 'create';

  try {
    await backupDatabase(action);
  } catch (error) {
    console.error('❌ Backup operation failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { backupDatabase, autoBackup, createBackup, listBackups, validateBackup, restoreBackup }; 