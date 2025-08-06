#!/usr/bin/env node
/**
 * Utility script to reset a client's password
 * Usage: node scripts/reset_client_password.js <email> [password]
 * If password is not provided, defaults to "password"
 */

import { Client } from '../src/models/index.js';
import bcrypt from 'bcrypt';

const resetClientPassword = async (email, newPassword = 'password') => {
  try {
    const client = await Client.findOne({
      where: { email: email.toLowerCase() }
    });

    if (!client) {
      console.error(`❌ Client with email "${email}" not found`);
      process.exit(1);
    }

    console.log(`📧 Found client: ${client.email} (${client.name})`);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update directly with raw SQL to bypass hooks and prevent double hashing
    await Client.sequelize.query(
      'UPDATE clients SET password = ?, updatedAt = NOW() WHERE email = ?',
      {
        replacements: [hashedPassword, email.toLowerCase()],
        type: Client.sequelize.QueryTypes.UPDATE
      }
    );

    // Verify the password works
    const updatedClient = await Client.findOne({
      where: { email: email.toLowerCase() }
    });

    const isPasswordValid = await bcrypt.compare(newPassword, updatedClient.password);

    if (isPasswordValid) {
      console.log('✅ Password reset successful!');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${newPassword}`);
    } else {
      console.error('❌ Password reset failed - verification unsuccessful');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
    process.exit(1);
  }
};

// Get command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/reset_client_password.js <email> [password]');
  console.log('Example: node scripts/reset_client_password.js steps@nuimitech.com');
  console.log('Example: node scripts/reset_client_password.js steps@nuimitech.com mypassword');
  process.exit(1);
}

const email = args[0];
const password = args[1];

resetClientPassword(email, password).then(() => {
  process.exit(0);
});