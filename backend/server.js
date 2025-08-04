import app from './src/app.js';
import { sequelize } from './src/config/database.js';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Create __filename and __dirname equivalents for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

// Connect to the database
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`iUtility Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
