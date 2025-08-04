# iUtility Database Migrations

Comprehensive database migrations for the iUtility system.

## Quick Start

```bash
# Run all migrations
node src/migrations/migrate.js up

# Rollback all migrations
node src/migrations/migrate.js down

# Check status
node src/migrations/migrate.js status

# Create backup
node src/migrations/backup.js create
```

## Migration Files

1. **001_enhance_api_keys.js** - Add service subscription fields to API keys
2. **002_create_utility_transactions.js** - Create UtilityTransaction table
3. **003_migrate_topup_data.js** - Migrate TopUpRequest data
4. **004_set_default_api_key_permissions.js** - Set default permissions
5. **005_update_wallet_transactions.js** - Update WalletTransaction references
6. **006_validate_migration.js** - Validate migration integrity

## Safety Features

- Automatic backup before migrations
- Comprehensive rollback capabilities
- Data validation and integrity checks
- Migration status tracking

## Troubleshooting

- Use `status` command to check migration state
- Create backup before running migrations
- Use rollback if issues occur
- Check logs for specific error messages
