# Database Migration Scripts

## User Migration Script

This script migrates user data from the old schema to the new schema structure.

### What it does:
- Converts old `subscription` string field to nested object with `type`, `startDate`, `endDate`, `autoRenew`
- Adds missing `username` field for users (generated from email if missing)
- Ensures all users have proper data structure

### How to run:

```bash
cd backend
node scripts/migrateUsers.js
```

### When to run:
- After updating the User model with new subscription structure
- If you see errors loading user data in the admin panel
- Before deploying to production with the new schema

### Safety:
- Safe to run multiple times (idempotent)
- Only updates users that need migration
- Does not delete any data
